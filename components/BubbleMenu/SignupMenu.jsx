import BubbleMenu from "./BubbleMenu";

export default function SignupMenu() {
  const items = [
    {
      label: "Sign up as User",
      href: "/login/user",
      rotation: -8,
      hoverStyles: { bgColor: "#3b82f6", textColor: "#fff" }
    },
    {
      label: "Sign up as Host",
      href: "/login/host",
      rotation: 8,
      hoverStyles: { bgColor: "#10b981", textColor: "#fff" }
    }
  ];

  return (
    <BubbleMenu
      logo={<span style={{ fontWeight: 700 }}>EV</span>}
      items={items}
      menuAriaLabel="Open signup menu"
      menuBg="#ffffff"
      menuContentColor="#111111"
      useFixedPosition={false}
      animationEase="back.out(1.5)"
      animationDuration={0.5}
      staggerDelay={0.12}
    />
  );
}
