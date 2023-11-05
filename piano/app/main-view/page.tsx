"use client";
import { redirect } from "next/navigation";
import MainView from "../components/MainView";
import RollsList from "../components/RollsList";

const Page = ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) => {
  const itemId = searchParams.id;

  if (!itemId) {
    redirect("/");
  }
  return (
    <div className="h-[calc(100vh-44px)]">
      <div className="container m-auto mt-[2rem] flex h-full grid-cols-12 flex-col gap-[2rem] md:grid">
        <MainView itemId={+itemId} />
        <RollsList />
      </div>
    </div>
  );
};

export default Page;
