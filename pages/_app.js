import "@/styles/globals.css";
import { Provider } from "react-redux";
import { store } from "@/utils/store";
import { SessionProvider, useSession } from "next-auth/react";
import { useRouter } from "next/router";
function App({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Provider store={store}>
        {Component.auth ? (
          <Auth>
            <Component {...pageProps} />
          </Auth>
        ) : (
          <Component {...pageProps} />
        )}
      </Provider>
    </SessionProvider>
  );
}
function Auth({ children }) {
  const router = useRouter();
  const { status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/unauthorized?message=login required");
    },
  });
  if (status === "loading") {
    return <h1>Loading...</h1>;
  }
  return children;
}
export default App;
