import useDocumentTitle from "../../hooks/title";

export function Home() {
  useDocumentTitle("Website Title For Home Page");
  return <h1>Home Page</h1>;
}
