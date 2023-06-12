// Add <Header /> into <SessionProvider /> in _app.tsx, if you want Header component show up in each page

import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { useBuyCredits } from "../hooks/useBuyCredits";
import { api } from "../utils/api";
import { Button } from "./Button";
import PrimaryLink from "./PrimaryLink";

import { Alert } from "flowbite-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const Header = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isOpenHamburger, setIsOpenHamburger] = useState<boolean>(false);

  // useRef combined with useEffect implement function of closing the dropdown menu when clicking outside of it
  // dropdownRef is for the google image dropdown menu
  const dropdownRef = useRef<HTMLDivElement>(null);
  // mobileMenuRef is for hamburger mobile menu

  // mobileMenuRef doesn't work
  // const mobileMenuRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  // useEffect watches both dropdownRef and mobileMenuRef
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
      // else if (
      //   mobileMenuRef.current &&
      //   !mobileMenuRef.current.contains(event.target as Node)
      // ) {
      //   setIsOpenHamburger(false);
      // }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // useSession() is from next-auth
  const session = useSession();
  // console.log(session.data);
  // The double negation (!!value) is a shorthand way to coerce a value to a boolean.
  // It returns true if the value is truthy and false if the value is falsy.
  // You can't miss .data here
  const isLoggedIn = !!session.data;
  // session.data?.user.image;

  const { buyCredits } = useBuyCredits();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log((error as Error).message);
    }
  };
  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.log((error as Error).message);
    }
  };

  // const credits = api.user.getUserCredits.useQuery().data;

  const credits = api.user.getUserCredits.useQuery(undefined, {
    enabled: isLoggedIn,
  });

  return (
    <header className="container mx-auto my-3 flex h-24 max-w-6xl items-center justify-between px-2 shadow-md">
      {/* flex container for the left part starts  */}
      <div className="flex gap-6 self-center">
        <div className="flex items-center">
          <PrimaryLink href="/">
            <div className="flex items-center gap-4">
              <Image
                src="/media/rabbit_bot_no_bg.png"
                alt="Site logo"
                width={70}
                height={70}
                className="align-self flex self-center"
              />
              <h1 className="text-2xl lg:hidden">Icon Generator</h1>
            </div>
          </PrimaryLink>
        </div>

        <ul className="hidden gap-4 self-center lg:flex">
          <li>
            <PrimaryLink href="/generate">Generate Icons</PrimaryLink>
          </li>
          <li>
            <PrimaryLink href="/community">Community</PrimaryLink>
          </li>
          {isLoggedIn && (
            <li>
              <PrimaryLink href="/collection">Collection</PrimaryLink>
            </li>
          )}
        </ul>
      </div>
      {/* Ends */}

      {/* Right part starts */}
      <div>
        {isLoggedIn ? (
          <div ref={dropdownRef}>
            <div className="hidden gap-4 lg:flex">
              {credits.data !== undefined && (
                <div className="self-center rounded-md border border-pink-600 px-4 py-2 text-pink-600">
                  {`${credits.data} credits left`}
                </div>
              )}
              <Button variant="secondary" onClick={buyCredits}>
                Buy Credits
              </Button>

              <div>
                <Image
                  src={session.data?.user.image ?? "/favicon.ico"}
                  alt="generated image from your prompt"
                  width="40"
                  height="20"
                  className="cursor-pointer"
                  onClick={toggleDropdown}
                />
              </div>
            </div>

            {isOpen && (
              <div
                // ref={dropdownRef}
                className="absolute right-0 mt-2 w-72 rounded-md bg-teal-900 shadow-lg ring-1 ring-black ring-opacity-5"
              >
                <div className=" py-1">
                  <div className="border-b border-b-stone-500 px-4 py-1">
                    <div>{session.data.user.name}</div>
                    <div>{session.data.user.email}</div>
                  </div>
                  <a
                    href="#"
                    className="block border-b border-b-stone-500 px-4 py-4 text-sm hover:bg-teal-800 hover:text-orange-500"
                  >
                    Delete my account
                  </a>

                  <a
                    className="block cursor-pointer px-4 py-4 text-sm hover:bg-teal-800 hover:text-orange-500"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </a>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="hidden gap-4 lg:flex">
            <Button variant="secondary" onClick={handleSignIn}>
              Login
            </Button>
          </div>
        )}
      </div>

      {/* Hamburger menu starts */}

      <button
        onClick={() => setIsOpenHamburger((prev) => !prev)}
        // className={`relative z-40 h-8 w-8 border-orange-500 transition-transform duration-300 ease-in lg:hidden ${
        //   isOpenHamburger ? "translate-y-0" : ("" as string)
        // }`}
        className="relative z-40 h-8 w-8 border-orange-500 transition-transform duration-300 ease-in lg:hidden"
      >
        <span
          className={`top absolute left-0 top-0 h-1 w-7 rotate-0 bg-orange-600 transition-transform duration-300 ${
            isOpenHamburger
              ? "translate-y-3.5 rotate-45 transform"
              : ("" as string)
          }`}
        ></span>
        <span
          className={`middle absolute left-0 top-0 h-1 w-7 translate-y-2.5 rotate-0 bg-orange-600 transition-transform duration-300 ${
            isOpenHamburger ? "hidden" : ("" as string)
          }`}
        ></span>
        <span
          className={`bottom absolute left-0 top-0 h-1 w-7 translate-y-5 rotate-0 bg-orange-600 transition-transform duration-300 ${
            isOpenHamburger
              ? "!translate-y-3.5 !-rotate-45 !transform"
              : ("" as string)
          }`}
        ></span>
      </button>

      {/* Ends */}

      {/* <!-- mobile menu --> */}
      <div
        // ref={mobileMenuRef}
        id="mobile-menu"
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        className={`z-100 absolute left-6 right-6 top-20  rounded-lg  bg-stone-900 p-6 opacity-90 ${
          !isOpenHamburger ? "hidden" : ("" as string)
        }`}
      >
        {isLoggedIn ? (
          <div className="flex w-full flex-col items-center justify-center space-y-4 font-semibold">
            <button
              className="py-3 transition-opacity duration-500 hover:w-full hover:rounded-full hover:opacity-80 hover:outline hover:outline-2"
              onClick={buyCredits}
            >
              Buy Credits{" "}
              {credits.data !== undefined && (
                <span className="text-pink-600">
                  ( {credits.data} credits left )
                </span>
              )}
            </button>

            <Link
              href="/generate"
              onClick={() => setIsOpenHamburger((prev) => !prev)}
              className="py-3 text-center transition-opacity duration-500 hover:w-full hover:rounded-full hover:opacity-80 hover:outline hover:outline-2"
            >
              Generate Icons
            </Link>
            <Link
              href="/community"
              onClick={() => setIsOpenHamburger((prev) => !prev)}
              className="py-3 text-center transition-opacity duration-500 hover:w-full hover:rounded-full hover:opacity-80 hover:outline hover:outline-2"
            >
              Community
            </Link>

            <Link
              href="/collection"
              onClick={() => setIsOpenHamburger((prev) => !prev)}
              className="py-3 text-center transition-opacity duration-500 hover:w-full hover:rounded-full hover:opacity-80 hover:outline hover:outline-2"
            >
              collection
            </Link>

            <div className="w-full border border-b-orange-700"></div>

            <button className="py-3 pt-3 transition-opacity duration-500 hover:w-full hover:rounded-full hover:opacity-80 hover:outline hover:outline-2">
              Delete my account
            </button>

            <button
              className="py-3 pt-3 transition-opacity duration-500 hover:w-full hover:rounded-full hover:opacity-80 hover:outline hover:outline-2"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center space-y-4 font-semibold">
            <Link
              href="/generate"
              onClick={() => setIsOpenHamburger((prev) => !prev)}
              className="py-3 text-center transition-opacity duration-500 hover:w-full hover:rounded-full hover:opacity-80 hover:outline hover:outline-2"
            >
              Generate Icons
            </Link>
            <Link
              href="/community"
              onClick={() => setIsOpenHamburger((prev) => !prev)}
              className="py-3 text-center transition-opacity duration-500 hover:w-full hover:rounded-full hover:opacity-80 hover:outline hover:outline-2"
            >
              Community
            </Link>
            <div className="w-full border border-b-orange-700"></div>
            <button
              className="py-3 pb-3 text-center transition-opacity duration-500 hover:w-full hover:rounded-full hover:opacity-80 hover:outline hover:outline-2"
              onClick={handleSignIn}
            >
              Login
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

// hamburger menu set up
// .open {
//   transform: rotate(90deg);       rotate-90
//   transform: translateY(0px);     translate-y-0
// }

// .open .top {
//   transform: rotate(45deg) translateY(6px) translateX(6px);    transform rotate-45 translate-y-6 translate-x-6
// }

// .open .middle {
//   display: none;   hidden
// }

// .open .bottom {
//   transform: rotate(-45deg) translateY(6px) translateX(-6px);    transform -rotate-45 translate-y-6 -translate-x-6
// }
