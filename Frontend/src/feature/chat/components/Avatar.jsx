import { STATUS_COLOR } from "../constants";

export default function Avatar({ initials, gradient, size = "md", status, profilePic }) {
  const sizes = { sm: "w-8 h-8 text-[10px]", md: "w-10 h-10 text-xs", lg: "w-12 h-12 text-sm" };
  const dotSizes = { sm: "w-2.5 h-2.5 border-[1.5px]", md: "w-3 h-3 border-2", lg: "w-3.5 h-3.5 border-2" };
  return (
    <div className="relative shrink-0">
      <div className={`${sizes[size]} rounded-full bg-linear-to-br ${gradient} flex items-center justify-center font-bold text-white overflow-hidden`}>
        {profilePic
          ? <img src={profilePic} alt="avatar" className="w-full h-full object-cover" />
          : initials
        }
      </div>
      {status && <span className={`absolute bottom-0 right-0 ${dotSizes[size]} rounded-full ${STATUS_COLOR[status]} border-[#0F172A]`} />}
    </div>
  );
}
