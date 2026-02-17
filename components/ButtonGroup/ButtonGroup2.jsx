import React from 'react'

const ButtonGroup2 = () => {
  return (
    <div className='inline-flex rounded-lg'>
      <a
        href='#'
        className='border-primary bg-primary hover:border-primary hover:bg-primary inline-flex items-center justify-center rounded-l-md border py-[11px] px-[12px] text-center text-base font-medium text-white transition-all hover:text-white sm:px-6'
      >
        About
      </a>
      <a
        href='#'
        className='border-stroke dark:border-dark-3 hover:border-primary hover:bg-primary inline-flex items-center justify-center border-y py-[11px] px-[12px] text-center text-base font-medium text-dark dark:text-white transition-all hover:text-white sm:px-6 sm:text-base'
      >
        Profile
      </a>
      <a
        href='#'
        className='border-stroke dark:border-dark-3 hover:border-primary hover:bg-primary inline-flex items-center justify-center rounded-r-md border py-[11px] px-[12px] text-center text-base font-medium text-dark dark:text-white transition-all hover:text-white sm:px-6 sm:text-base'
      >
        Services
      </a>
    </div>
  )
}

export default ButtonGroup2