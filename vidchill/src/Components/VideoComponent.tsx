import Image from "next/image";

export function UserImage({
  image,
  className = "",
}: {
  image: string;
  className?: string;
}) {
  return (
    <div className={`relative h-9 w-9 ${className}`}>
      <Image
        src={image || "/profile.jpg"}
        alt=""
        className="fill absolute rounded-full"
      />
    </div>
  );
}
