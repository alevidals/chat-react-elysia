import { Link } from "react-router";
import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <h1>Hola</h1>
      <Link to="/1">Chat 1</Link>
      <Link to="/2">Chat 2</Link>
    </div>
  );
}
