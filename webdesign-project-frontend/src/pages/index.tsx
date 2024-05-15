/* eslint-disable @next/next/no-img-element */
import { type NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";

const Home: NextPage = () => {
  const router = useRouter()

  useEffect(() => {
    router.replace("/landing")
  }, [router])
  return <>
  </>;
};

export default Home;

