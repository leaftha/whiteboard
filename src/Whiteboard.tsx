import { useSync } from "@tldraw/sync";
import { useLocation } from "react-router-dom";
import {
  AssetRecordType,
  getHashForString,
  TLAssetStore,
  TLBookmarkAsset,
  Tldraw,
  uniqueId,
} from "tldraw";
import "tldraw/tldraw.css";

const WORKER_URL = `http://localhost:5858`;

// 이 예시에서는 방 ID가 하드코딩되어 있습니다. 하지만 원하는 대로 설정할 수 있습니다.

function WhiteBoard() {
  let { state } = useLocation();

  // 멀티플레이어에 연결된 스토어를 만듭니다.
  const store = useSync({
    // We need to know the websocket's URI...
    uri: `${WORKER_URL}/connect/${state.roomeId}`,
    // ...그리고 이미지 및 비디오와 같은 정적 자산을 처리하는 방법
    assets: multiplayerAssets,
  });

  return (
    <div style={{ position: "fixed", inset: 0 }}>
      <Tldraw
        // 연결된 저장소를 Tldraw 컴포넌트로 전달하여
        // 상태 로딩 및 커서, 상태 메뉴와 같은 멀티플레이어 UX 활성화를 처리할 수 있습니다.
        store={store}
        autoFocus
        onMount={(editor) => {
          // @ts-expect-error
          window.editor = editor;
          // 편집기가 준비되면 북마크 펼치기 서비스를 등록해야 합니다.
          editor.registerExternalAssetHandler("url", unfurlBookmarkUrl);
        }}
      />
    </div>
  );
}

// 우리 서버는 이미지나 비디오와 같은 자산을 어떻게 처리하나요?
const multiplayerAssets: TLAssetStore = {
  async upload(_asset, file) {
    // 자산을 업로드하려면 고유 ID를 접두사로 붙이고 이를 작업자에게 POST한 후 URL을 반환합니다.
    const id = uniqueId();

    const objectName = `${id}-${file.name}`;
    const url = `${WORKER_URL}/uploads/${encodeURIComponent(objectName)}`;

    const response = await fetch(url, {
      method: "PUT",
      body: file,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload asset: ${response.statusText}`);
    }

    return { src: url };
  },
  // 자산을 검색하려면 동일한 URL을 사용하면 됩니다. 이를 사용자 지정하여 추가 인증을 추가하거나
  // 자산의 최적화된 버전/크기를 제공할 수 있습니다.
  resolve(asset) {
    return asset.props.src;
  },
};

// 우리 서버는 북마크 펼침을 어떻게 처리하나요?
async function unfurlBookmarkUrl({
  url,
}: {
  url: string;
}): Promise<TLBookmarkAsset> {
  const asset: TLBookmarkAsset = {
    id: AssetRecordType.createId(getHashForString(url)),
    typeName: "asset",
    type: "bookmark",
    meta: {},
    props: {
      src: url,
      description: "",
      image: "",
      favicon: "",
      title: "",
    },
  };

  try {
    const response = await fetch(
      `${WORKER_URL}/unfurl?url=${encodeURIComponent(url)}`
    );
    const data = await response.json();

    asset.props.description = data?.description ?? "";
    asset.props.image = data?.image ?? "";
    asset.props.favicon = data?.favicon ?? "";
    asset.props.title = data?.title ?? "";
  } catch (e) {
    console.error(e);
  }

  return asset;
}

export default WhiteBoard;
