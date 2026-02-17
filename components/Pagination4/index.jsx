import React from "react";

const Pagination4 = () => {
  return (
    <section className="py-20 dark:bg-dark">
      <div className="text-center">
        <div className="mb-12 inline-flex rounded bg-white p-3 shadow-1 dark:bg-dark-2 dark:shadow-3">
          <ul className="-mx-[6px] flex items-center">
            <li className="px-[6px]">
              <a
                href="/#"
                className="flex h-6 items-center justify-center rounded px-3 text-xs text-dark hover:bg-[#EDEFF1] dark:text-white dark:hover:bg-white/5"
              >
                <span className="mr-1">
                  <svg
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.5 6.0875H2.49375L5.68125 2.84375C5.85 2.675 5.85 2.4125 5.68125 2.24375C5.5125 2.075 5.25 2.075 5.08125 2.24375L1.2 6.18125C1.03125 6.35 1.03125 6.6125 1.2 6.78125L5.08125 10.7188C5.15625 10.7937 5.26875 10.85 5.38125 10.85C5.49375 10.85 5.5875 10.8125 5.68125 10.7375C5.85 10.5687 5.85 10.3063 5.68125 10.1375L2.5125 6.93125H10.5C10.725 6.93125 10.9125 6.74375 10.9125 6.51875C10.9125 6.275 10.725 6.0875 10.5 6.0875Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
                Previous
              </a>
            </li>

            <PageLink count="1" pageSrc="/#" />
            <PageLink count="2" pageSrc="/#" />
            <PageLink count="3" pageSrc="/#" />
            <PageLink count="4" pageSrc="/#" />

            <li>
              <a
                href="/#"
                className="flex h-6 items-center justify-center rounded px-3 text-xs text-dark hover:bg-[#EDEFF1] dark:text-white dark:hover:bg-white/5"
              >
                Next
                <span className="ml-1">
                  <svg
                    width="12"
                    height="13"
                    viewBox="0 0 12 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M10.8 6.2L6.91875 2.2625C6.75 2.09375 6.4875 2.09375 6.31875 2.2625C6.15 2.43125 6.15 2.69375 6.31875 2.8625L9.46875 6.06875H1.5C1.275 6.06875 1.0875 6.25625 1.0875 6.48125C1.0875 6.70625 1.275 6.9125 1.5 6.9125H9.50625L6.31875 10.1563C6.15 10.325 6.15 10.5875 6.31875 10.7563C6.39375 10.8313 6.50625 10.8688 6.61875 10.8688C6.73125 10.8688 6.84375 10.8313 6.91875 10.7375L10.8 6.8C10.9688 6.63125 10.9688 6.36875 10.8 6.2Z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Pagination4;

const PageLink = ({ pageSrc, count }) => {
  return (
    <li className="px-[6px]">
      <a
        href={pageSrc}
        className="flex h-6 min-w-[24px] items-center justify-center rounded px-1 text-base text-body-color hover:bg-[#EDEFF1] dark:hover:bg-white/5 dark:hover:text-white"
      >
        {count}
      </a>
    </li>
  );
};
