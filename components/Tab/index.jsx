import React, { useState } from "react";

const Tab = () => {
  const [open, setOpen] = useState("home");

  const handleTabOpen = (tabCategory) => {
    setOpen(tabCategory);
  };

  return (
    <>
      <section className="py-20 lg:py-[120px]">
        <div className="container">
          <div className="flex flex-wrap -mx-4">
            <div className="w-full px-4">
              <div className="w-full mb-14">
                <div className="flex flex-wrap rounded-lg border border-[#E4E4E4] py-3 px-4 space-x-2">
                  <a
                    onClick={() => handleTabOpen("home")}
                    className={`rounded-md py-3 px-4 text-sm font-medium md:text-base lg:px-6 hover:bg-blue-500 hover:text-white transition-all delay-75 cursor-pointer ${
                      open === "home" ? "bg-primary text-white" : " "
                    }`}
                  >
                    Home
                  </a>
                  <a
                    onClick={() => handleTabOpen("about")}
                    className={`rounded-md py-3 px-4 text-sm font-medium md:text-base lg:px-6 hover:bg-blue-500 hover:text-white transition-all delay-75 cursor-pointer ${
                      open === "about" ? "bg-primary text-white" : " "
                    }`}
                  >
                    About Us
                  </a>
                  <a
                    onClick={() => handleTabOpen("team")}
                    className={`rounded-md py-3 px-4 text-sm font-medium md:text-base lg:px-6 hover:bg-blue-500 hover:text-white transition-all delay-75 cursor-pointer ${
                      open === "team" ? "bg-primary text-white" : " "
                    }`}
                  >
                    Our Team
                  </a>
                  <a
                    onClick={() => handleTabOpen("company")}
                    className={`rounded-md py-3 px-4 text-sm font-medium md:text-base lg:px-6 hover:bg-blue-500 hover:text-white transition-all delay-75 cursor-pointer ${
                      open === "company" ? "bg-primary text-white" : " "
                    }`}
                  >
                    Company Details
                  </a>
                </div>
                <TabContent
                  details=" Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! Quas sit odit optio debitis nulla quisquam, dolorum quaerat animi iusto quod."
                  tabCategory="home"
                  open={open}
                />
                <TabContent
                  details=" Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! "
                  tabCategory="about"
                  open={open}
                />
                <TabContent
                  details="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! Quas sit odit optio debitis nulla quisquam, dolorum quaerat animi iusto quod.

              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Suscipit mollitia nam eligendi reprehenderit reiciendis saepe laboriosam maiores voluptas. Quo, culpa amet fugiat ipsam sed quod hic, veritatis ducimus recusandae repellat quasi eaque, suscipit praesentium totam?"
                  tabCategory="team"
                  open={open}
                />
                <TabContent
                  details="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Officia nisi, doloribus nulla cumque molestias corporis eaque harum vero! Quas sit odit optio debitis nulla quisquam, dolorum quaerat animi iusto quod."
                  tabCategory="company"
                  open={open}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Tab;

const TabContent = ({ open, tabCategory, details }) => {
  return (
    <div>
      <div
        className={`p-6 text-base leading-relaxed text-body-color ${
          open === tabCategory ? "block" : "hidden"
        } `}
      >
        {details}
      </div>
    </div>
  );
};
