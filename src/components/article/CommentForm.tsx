"use client";

import { useState } from "react";
import { useTranslations } from "@/hooks/useTranslations";

export default function CommentForm() {
  const t = useTranslations();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [comment, setComment] = useState("");
  const [saveInfo, setSaveInfo] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div className="comments-area mb-[30px] bg-[#f8f9fa] border border-border rounded-[10px] p-[30px]">
      <div className="comment-respond">
        <h4 className="comment-reply-title font-title text-black text-[22px] font-bold mb-[10px]">
          {t("article.leaveComment")}
        </h4>

        <form onSubmit={handleSubmit} className="comment-form mt-[15px]">
          <p className="comment-notes text-[15px] text-bodyColor mb-[25px] w-full">
            <span id="email-notes">{t("article.notPublished")}</span>
            <span className="required-field-message font-medium"> {t("article.requiredFields")} <span className="required text-primaryColor">*</span></span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[20px]">
            <p className="comment-form-author mb-[20px]">
              <input
                id="author"
                type="text"
                placeholder={t("article.fullName")}
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-transparent border-b border-border pb-[10px] text-[15px] text-titleColor placeholder:text-bodyColor outline-none focus:border-primaryColor transition-colors font-body"
              />
            </p>

            <p className="comment-form-email mb-[20px]">
              <input
                id="email"
                type="email"
                placeholder={t("article.emailPlaceholder")}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent border-b border-border pb-[10px] text-[15px] text-titleColor placeholder:text-bodyColor outline-none focus:border-primaryColor transition-colors font-body"
              />
            </p>
          </div>

          <p className="comment-form-url mb-[20px]">
            <input
              id="url"
              type="url"
              placeholder={t("article.websitePlaceholder")}
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full bg-transparent border-b border-border pb-[10px] text-[15px] text-titleColor placeholder:text-bodyColor outline-none focus:border-primaryColor transition-colors font-body"
            />
          </p>

          <p className="comment-form-comment mb-[25px]">
            <textarea
              id="comment"
              placeholder={t("article.commentPlaceholder")}
              required
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-transparent border-b border-border pb-[10px] text-[15px] text-titleColor placeholder:text-bodyColor outline-none focus:border-primaryColor transition-colors font-body resize-none"
            />
          </p>

          <p className="comment-form-cookies-consent flex items-center mb-[25px]">
            <input
              id="wp-comment-cookies-consent"
              type="checkbox"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
              className="w-[15px] h-[15px] rounded-[3px] border border-border accent-primaryColor cursor-pointer"
            />
            <label htmlFor="wp-comment-cookies-consent" className="text-bodyColor text-[15px] font-normal leading-[1.6] ml-[10px] cursor-pointer">
              {t("article.saveMyInfo")}
            </label>
          </p>

          <p className="form-submit mt-[20px]">
            <button
              type="submit"
              className="submit-btn inline-flex items-center justify-center h-[50px] px-[30px] bg-[#007AFF] text-white font-medium text-[15px] rounded-[6px] hover:bg-black transition-all duration-300"
            >
              {t("article.submit")}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}