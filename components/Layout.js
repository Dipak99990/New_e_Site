import Head from "next/head";
import React from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import { signOut, useSession } from "next-auth/react";
import { Menu } from "@headlessui/react";
import DropdownLink from "./DropdownLink";
import { useState, useEffect } from "react";
import { cartReset } from "@/features/cartSLice";
import { ShoppingCartIcon } from "@heroicons/react/solid";
function Layout({ title, children }) {
  const { data: session, status } = useSession();
  const dispatch = useDispatch();
  const { amount } = useSelector((store) => store.cart);
  const { cartItems } = useSelector((store) => store.cart);
  const logoutClickHandler = () => {
    signOut({ callbackUrl: "/login" });
    dispatch(cartReset());
  };
  const [newAmount, setnewAmount] = useState("");
  useEffect(() => {
    setnewAmount(amount);
  }, [cartItems]);
  return (
    <>
      <Head>
        <title>{title ? title + "-Amazona" : "Amazona"}</title>
        <meta name="description" content="E commerce website" />
      </Head>
      <ToastContainer position="bottom-center" limit={1} />
      <div className="flex flex-col justify-between h-screen">
        <header>
          <nav className="flex items-center justify-between h-15 px-4 shadow-md">
            <div className="flex">
              <Link href="/">
                <span className="font-bold text-2xl">
                  New Sharma Furniture Udhyoug
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center">
                <Link href="/cart">
                  {newAmount > 0 ? (
                    <span className="relative">
                      <span className="absolute top-4 -left-3 bg-red-600 text-xs px-1 rounded-full font-bold text-white">
                        {newAmount}
                      </span>
                      <span className="p-2">
                        <ShoppingCartIcon className="w-8 h-8 " />
                      </span>
                    </span>
                  ) : (
                    <span className="p-2">
                      <ShoppingCartIcon className="w-8 h-8" />
                    </span>
                  )}
                </Link>
              </div>

              {status === "loading" ? (
                "loading"
              ) : (
                <div className="flex items-center pl-2">
                  {session?.user && (
                    <div className="pr-2">
                      <Menu
                        as="div"
                        className="relative inline-block text-right"
                      >
                        <div>
                          <Menu.Button className="text-blue-600">
                            {session.user.name}
                          </Menu.Button>

                          <Menu.Items className="absolute right-0 w-56 origin-top-right bg-white shadow-lg">
                            <Menu.Item as="div">
                              <DropdownLink
                                className="dropdown-link"
                                href="/order-history"
                              >
                                Order History
                              </DropdownLink>
                              <DropdownLink
                                className="dropdown-link"
                                href="#"
                                onClick={logoutClickHandler}
                              >
                                LogOut
                              </DropdownLink>
                            </Menu.Item>
                          </Menu.Items>
                        </div>
                      </Menu>
                    </div>
                  )}
                  <div className="pl-2">
                    {session?.user ? (
                      <span className="p-2">{session.user.username}</span>
                    ) : (
                      <Link href="/login">
                        <span className="p-2">Login</span>
                      </Link>
                    )}
                  </div>
                </div>
              )}
            </div>
          </nav>
        </header>
        <main className="container m-auto mt-4 px-4">{children}</main>

        <footer className="flex items-center justify-center h-10 shadow-inner">
          <p className="font-bold">© 2023 New Sharma Furniture Udhyoug</p>
        </footer>
      </div>
    </>
  );
}

export default Layout;
