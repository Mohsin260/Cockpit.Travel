export default function AuthorBox({
  author,
}: {
  author: { name: string; avatar: string; bio: string };
}) {
  return (
    <div className="rstb-author-info-box flex flex-col sm:flex-row items-center sm:items-start mb-[30px] bg-shade rounded-[8px] p-[30px] sm:pr-[120px]">
      <div className="author-avatar flex-shrink-0 mb-[20px] sm:mb-0 sm:mr-[30px]">
        {author.avatar ? (
          <img
            src={author.avatar}
            alt={author.name}
            className="w-[160px] h-[160px] rounded-full object-cover border-[5px] border-white"
          />
        ) : (
          <div className="w-[160px] h-[160px] rounded-full bg-primary/10 border-[5px] border-white flex items-center justify-center">
            <span className="text-4xl font-bold text-primary">{author.name?.charAt(0) || "A"}</span>
          </div>
        )}
      </div>
      <div className="author-desc flex-1 text-center sm:text-left">
        <h3 className="author-name font-title text-titleColor text-[20px] font-bold mb-[7px]">
          {author.name}
        </h3>
        <p className="author-bio text-bodyColor text-[15px] leading-[1.65] mb-[20px]">
          {author.bio}
        </p>
        <div className="author-social-profile flex flex-wrap justify-center sm:justify-start gap-[10px]">
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="flex items-center justify-center w-[32px] h-[32px] rounded-[3px] bg-primary text-white hover:bg-primary transition-colors duration-300">
            <i className="ri-facebook-fill text-[16px] text-white"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="flex items-center justify-center w-[32px] h-[32px] rounded-[3px] bg-primary text-white hover:bg-primary transition-colors duration-300">
            <i className="ri-twitter-x-fill text-[16px] text-white"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex items-center justify-center w-[32px] h-[32px] rounded-[3px] bg-primary text-white hover:bg-primary transition-colors duration-300">
            <i className="ri-instagram-line text-[16px] text-white"></i>
          </a>
          <a href="#" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="flex items-center justify-center w-[32px] h-[32px] rounded-[3px] bg-primary text-white hover:bg-primary transition-colors duration-300">
            <i className="ri-linkedin-fill text-[16px] text-white"></i>
          </a>
        </div>
      </div>
    </div>
  );
}
