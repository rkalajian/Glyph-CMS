import React from "react";

const Brand4 = () => {
  return (
    <>
      {/* ====== Brands Section Start */}
      <section className="bg-white dark:bg-dark py-20 lg:py-[120px]">
        <div className="container flex h-[60vh] justify-center items-center">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div className="mx-auto flex max-w-[570px] flex-wrap items-center justify-center">
                <SingleImage
                  href="#"
                  Alt="Brand Image"
                  imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/graygrids.svg"
                />
                <SingleImage
                  href="#"
                  Alt="Brand Image"
                  imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/lineicons.svg"
                />
                <SingleImage
                  href="#"
                  Alt="Brand Image"
                  imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/uideck.svg"
                />
                <SingleImage
                  href="#"
                  Alt="Brand Image"
                  imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/ayroui.svg"
                />
                <SingleImage
                  href="#"
                  Alt="Brand Image"
                  imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/plainadmin.svg"
                />
                <SingleImage
                  href="#"
                  Alt="Brand Image"
                  imgSrc="https://cdn.tailgrids.com/1.0/assets/images/brands/ecom.svg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* ====== Brands Section End */}
    </>
  );
};

export default Brand4;

const SingleImage = ({ href, imgSrc, Alt }) => {
  return (
    <>
      <a
        href={href}
        className="border-stroke flex h-[110px] max-w-[188px] items-center justify-center border px-7 hover:bg-primary/10 dark:border-primary/20"
      >
        <img src={imgSrc} alt={Alt} className="w-full h-10" />
      </a>
    </>
  );
};
