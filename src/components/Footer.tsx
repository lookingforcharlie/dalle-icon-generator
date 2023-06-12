import Image from "next/image";
import Link from "next/link";
import React from "react";

const Footer = () => {
  return (
    <footer className="m-4 rounded-lg  bg-white shadow dark:bg-gray-900">
      <div className="mx-auto w-full max-w-screen-xl p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <Link href="/" className="mb-4 flex items-center sm:mb-0">
            <Image
              src="/media/rabbit_bot_no_bg.png"
              alt="Site logo"
              width="50"
              height="100"
              className="align-self mr-3 flex h-12 self-center"
            />
            <span className="self-center whitespace-nowrap text-2xl font-semibold dark:text-white">
              Icon Generator
            </span>
          </Link>

          <ul className="mb-6 flex flex-wrap items-center text-sm font-medium text-gray-500 dark:text-gray-400 sm:mb-0">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                About
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Privacy Policy
              </a>
            </li>
            <li>
              <Link href="/generate" className="mr-4 hover:underline md:mr-6 ">
                Generate Icons
              </Link>
            </li>
            <li>
              <Link href="/community" className="hover:underline">
                Community
              </Link>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-gray-200 dark:border-gray-700 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-gray-500 dark:text-gray-400 sm:text-center">
          &copy; {new Date().getFullYear()} Icon Generator. All rights reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
