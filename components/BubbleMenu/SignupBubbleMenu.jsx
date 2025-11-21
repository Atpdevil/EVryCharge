import Link from "next/link";

export default function SignupBubbleMenu() {
  const items = [
    { label: "Sign up as User", href: "/login/user" },
    { label: "Sign up as Host", href: "/login/host" },
  ];

  return (
    <div className="flex flex-col gap-4 w-full max-w-md">
      {items.map((item, i) => (
        <Link
          key={i}
          href={item.href}
          className="
            bg-white
            shadow-md
            rounded-full
            py-4
            px-6
            text-center
            text-xl
            font-medium
            hover:scale-[1.03]
            transition
          "
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
}
