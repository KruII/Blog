import Link from "next/link";

export default function Home() {
  return (
    <div>
      <h1>Witamy na blogu!</h1>
      <nav>
        <ul>
          <li><Link href="/about">O mnie</Link></li>
          <li><Link href="/contact">Kontakt</Link></li>
          <li><Link href="/posts">Posty</Link></li>
        </ul>
      </nav>
    </div>
  );
}
