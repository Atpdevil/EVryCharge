export default function GradientText({
  colors = ["#40ffaa", "#4079ff", "#40ffaa"],
  animationSpeed = 3,
  className = "",
  children,
}) {
  const gradient = `linear-gradient(90deg, ${colors.join(", ")})`;

  return (
    <span
      className={`animated-gradient-text ${className}`}
      style={{
        "--gradient-bg": gradient,
        "--animation-speed": `${animationSpeed}s`,
      }}
    >
      <span className="text-content">{children}</span>
    </span>
  );
}
