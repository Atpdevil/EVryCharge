import { useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

const springValues = {
  damping: 30,
  stiffness: 100,
  mass: 2,
};

export default function TiltedCard({
  imageSrc,
  altText = "Tilted card image",
  captionText = "",
  containerHeight = "260px",
  containerWidth = "100%",
  imageHeight = "260px",
  imageWidth = "100%",
  scaleOnHover = 1.08,
  rotateAmplitude = 12,
}) {
  const ref = useRef(null);
  const x = useMotionValue();
  const y = useMotionValue();
  const rotateX = useSpring(0, springValues);
  const rotateY = useSpring(0, springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateFigcaption = useSpring(0);

  const [lastY, setLastY] = useState(0);

  function handleMouse(e) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;

    const rotationX = (offsetY / (rect.height / 2)) * -rotateAmplitude;
    const rotationY = (offsetX / (rect.width / 2)) * rotateAmplitude;

    rotateX.set(rotationX);
    rotateY.set(rotationY);

    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);

    const velocityY = offsetY - lastY;
    rotateFigcaption.set(-velocityY * 0.4);
    setLastY(offsetY);
  }

  return (
    <figure
      ref={ref}
      className="tilted-card-figure"
      style={{ height: containerHeight, width: containerWidth }}
      onMouseMove={handleMouse}
      onMouseEnter={() => {
        scale.set(scaleOnHover);
        opacity.set(1);
      }}
      onMouseLeave={() => {
        scale.set(1);
        opacity.set(0);
        rotateX.set(0);
        rotateY.set(0);
      }}
    >
        <motion.div
        className="tilted-card-inner"
        style={{
            width: imageWidth,
            height: imageHeight,
            rotateX,
            rotateY,
            scale,
        }}
        >
        <motion.img
            src={imageSrc}
            alt={altText}
            className="tilted-card-img"
            style={{ width: imageWidth, height: imageHeight }}
        />

        {/* NEW Bottom Caption */}
        <div className="tilted-card-bottom-caption">
            {captionText}
        </div>
        </motion.div>
    </figure>
  );
}
