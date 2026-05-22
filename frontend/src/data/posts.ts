// src/data/posts.ts
export type PostType = {
  id: number;
  user: string;
  avatar: string;
  time: string;
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  liked?: boolean;
};

export const posts: PostType[] = [
  {
    id: 1,
    user: "Antik Hater",
    avatar: "/images/img-07.png",
    time: "pred 2 hodinami",
    title: "Nejde mi internet",
    content: "Pocuvaj ma, nejde mi internet. Zaco ja platim?",
    likes: 1200,
    comments: 60,
    liked: true,
  },
  {
    id: 2,
    user: "Robert Galik",
    avatar: "/images/img-08.jpg",
    time: "pred 19 minútami",
    title: "Zajtra písomka z cloudov",
    content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab eveniet, consequatur praesentium, eaque",
    likes: 12,
    comments: 1,
  },
  {
    id: 3,
    user: "Pear Juice Gaming",
    avatar: "/images/img-05.jpg",
    time: "pred 5 minútami",
    title: "Jou, What's up, Super Mário je späť",
    content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum atque laboriosam, eaque nam consectetur distinctio amet possimus fugiat aperiam doloribus id recusandae voluptatem esse similique ducimus. Vitae aliquid eaque impedit!",
    image: "/images/img-06.jpg",
    likes: 120,
    comments: 5,
    liked: true,
  },
  {
    id: 4,
    user: "Roland Onofrej",
    avatar: "/images/img-09.png",
    time: "pred 42 minúnatmi",
    title: "Poznámky z Linuxu",
    content: "Lorem ipsum, dolor sit amet consectetur adipisicing elit. At perferendis distinctio, assumenda hic cumque itaque minima adipisci dolorum nesciunt impedit odit earum ea iste atque. Perspiciatis architecto expedita quam est. Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam sunt laudantium beatae? Odit nulla molestiae sapiente labore ipsum totam sint ex voluptatem ea excepturi cupiditate ut sit, expedita vitae laborum!",
    likes: 21,
    comments: 2,
  },
  {
    id: 5,
    user: "Peter Farkaš",
    avatar: "/images/img-04.jpg",
    time: "pred 21 hodinami",
    title: "To mlieko včera nebolo dobré",
    content: "Lorem ipsum dolor sit amet consectetur, adipisicing elit",
    likes: 550,
    comments: 36,
    liked: true,
  },
  {
    id: 6,
    user: "Ján Novák",
    avatar: "/images/img-02.jpg",
    time: "pred 5 minútami",
    title: "Ako zapnem PC?",
    content: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Laborum atque laboriosam, eaque nam consectetur distinctio amet possimus fugiat aperiam doloribus id recusandae voluptatem esse similique ducimus. Vitae aliquid eaque impedit!",
    image: "/images/img-03.webp",
    likes: 30,
    comments: 4,
    liked: true,
  },
  {
    id: 7,
    user: "Mgr. Alex Babják",
    avatar: "/images/img-12.jfif",
    time: "pred 2 hodinami",
    title: "Nemáte niekto úlohu z programka?",
    content: "",
    likes: 12,
    comments: 5,
  },
  {
    id: 8,
    user: "John Smith",
    avatar: "/images/img-10.avif",
    time: "pred 2 dňami",
    title: "I am selling this graphics card for $700.",
    content: "lgjdglofdp gfojdpg jfdog jfdog odfsgoi",
    image: "/images/img-11.jpg",
    likes: 30,
    comments: 4,
    liked: true,
  },
];