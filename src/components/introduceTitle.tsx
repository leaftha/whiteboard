import { motion } from "framer-motion";
import { ScrollTrigger } from "gsap/all";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import style from "../style/introduceTitle.module.css";

function IntroduceTitle() {
  const slider = useRef<HTMLDivElement>(null);
  const first = useRef<HTMLParagraphElement>(null);
  const second = useRef<HTMLParagraphElement>(null);

  let xPercent: number = 0;
  let direction: number = -1;

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (slider.current) {
      gsap.to(slider.current, {
        scrollTrigger: {
          trigger: document.documentElement,
          scrub: 0.25,
          start: 0,
          end: window.innerHeight,
          onUpdate: (e: { direction: number }) =>
            (direction = e.direction * -1),
        },
        x: "-500px",
      });
    }

    requestAnimationFrame(animate);
  }, []);

  const animate = () => {
    if (xPercent < -100) {
      xPercent = 0;
    } else if (xPercent > 0) {
      xPercent = -100;
    }

    if (first.current) {
      gsap.set(first.current, { xPercent: xPercent });
    }
    if (second.current) {
      gsap.set(second.current, { xPercent: xPercent });
    }

    requestAnimationFrame(animate);
    xPercent += 0.1 * direction;
  };

  const slideUp = {
    initial: {
      // y: 300,
    },
    enter: {
      // y: 0,
      transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1], delay: 2.5 },
    },
  };

  return (
    <motion.div
      className={style.main}
      variants={slideUp}
      initial="initial"
      animate="enter"
    >
      <div className={style.container}>
        <div className={style.titles} ref={slider}>
          <p ref={first}>협업을 위한 도구-</p>
          <p ref={second}>아이디어를 담아요-</p>
        </div>
      </div>
    </motion.div>
  );
}

export default IntroduceTitle;
