import Image from "next/image";

export function UserImage({
  image,
  className = "",
}: {
  image: string;
  className?: string;
}) {
  return (
    <div className={`relative h-10 w-10 ${className}`}>
      <Image
        src={image || "/profile.jpg"}
        alt=""
        className="fill absolute rounded-full"
        width={40}
        height={40}
      />
    </div>
  );
}
