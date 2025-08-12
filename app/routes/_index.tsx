import type { MetaFunction } from "@remix-run/node";
import Dashboard from "./dashboard";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <>
      <Dashboard />
    </>
  );
}
