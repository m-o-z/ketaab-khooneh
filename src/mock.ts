import type { Author, Book, User } from "@/types";

export const users: User[] = [
  {
    id: "1",
    firstName: "behnam",
    lastName: "banaei",
    image: "https://picsum.photos/202",
    email: "example@test.com",
    history: [],
  },
  {
    id: "2",
    firstName: "amin",
    lastName: "saveh",
    image: "https://picsum.photos/203",
    email: "example@test.com",
    history: [],
  },
];

export const authors: Author[] = [
  {
    id: "1",
    name: "amirhossein alibakhsi",
    bio: "lksdjflkdsf",
    image: "https://picsum.photos/201",
  },
  {
    id: "2",
    name: "hossein nasiri",
    bio: "lksdjflkdsf",
    image: "https://picsum.photos/200",
  },
];

// export const books: Book[] = [
//   {
//     title: "Clean Code",
//     authors,
//     coverImage: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
//     status: "BORROWED",
//     id: "1",
//     description:
//       "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
//     edition: "1",
//     releaseYear: "2023",
//     borrowedBy: users[0],
//     count: 2,
//     category: "123",
//     history: [],
//   },
//   {
//     title: "Clean Code",
//     authors,
//     coverImage: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
//     status: "AVAILABLE",
//     id: "2",
//     description:
//       "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
//     edition: "1",
//     releaseYear: "2023",
//     count: 1,
//     category: "123",
//     history: [],
//   },
//   {
//     title: "Clean Code",
//     authors,
//     coverImage: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
//     status: "NOT_AVAILABLE",
//     id: "3",
//     description:
//       "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
//     edition: "1",
//     releaseYear: "2023",
//     count: 1,
//     category: "123",
//     history: [],
//   },
//   {
//     title: "Clean Code",
//     authors,
//     coverImage: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
//     status: "RESERVED_BY_ME",
//     id: "4",
//     description:
//       "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
//     edition: "1",
//     releaseYear: "2023",
//     count: 1,
//     category: "123",
//     history: [],
//   },
//   {
//     title: "Clean Code",
//     authors,
//     coverImage: "https://m.media-amazon.com/images/I/51E2055ZGUL._SL1000_.jpg",
//     status: "RESERVED_BY_OTHERS",
//     id: "5",
//     description:
//       "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
//     edition: "1",
//     releaseYear: "2023",
//     reservedBy: users[1],
//     count: 1,
//     category: "123",
//     history: [],
//   },
// ];

export const books: Book[] = [
  {
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    authors: [
      {
        id: "author1",
        name: "Robert C. Martin",
        bio: "Robert C. Martin, also known as 'Uncle Bob,' is an American software engineer and author. He is a co-founder of the Agile Alliance and a leading figure in the field of software craftsmanship.",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/0/0d/Robert_Cecil_Martin.png",
      },
    ],
    coverImage: "https://m.media-amazon.com/images/I/413za4fzZLL.jpg",
    status: "BORROWED",
    id: "1",
    description:
      "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Clean code is about what makes code easy to read, understand, and maintain.",
    edition: "1",
    releaseYear: "2008",
    borrowedBy: {
      id: "user1",
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      image: "https://example.com/john-doe.jpg",
      history: [],
    },
    count: 2,
    category: "123",
    history: [],
  },
  {
    title: "Introduction to the Theory of Computation",
    authors: [
      {
        id: "author2",
        name: "Michael Sipser",
        bio: "Michael Sipser is a professor of Applied Mathematics and former Dean of the School of Science at the Massachusetts Institute of Technology. He is well known for his work in computational complexity theory.",
        image: "https://math.mit.edu/images/people/faculty/sipser.jpg",
      },
    ],
    coverImage:
      "https://m.media-amazon.com/images/I/61dPNb6AUJL._AC_UF1000,1000_QL80_.jpg",
    status: "AVAILABLE",
    id: "2",
    description:
      "The book offers a comprehensive introduction to automata theory, computability theory, and complexity theory.",
    edition: "3",
    releaseYear: "2012",
    count: 1,
    category: "124",
    history: [],
  },
  {
    title: "Artificial Intelligence: A Modern Approach",
    authors: [
      {
        id: "author3",
        name: "Stuart Russell",
        bio: "Stuart Russell is a professor of computer science at the University of California, Berkeley, and a leading authority on artificial intelligence. He is the co-author of one of the most widely used textbooks on AI.",
        image: "https://www2.eecs.berkeley.edu/Faculty/Photos/russell.jpg",
      },
      {
        id: "author4",
        name: "Peter Norvig",
        bio: "Peter Norvig is a director of research at Google and co-author of 'Artificial Intelligence: A Modern Approach.' He has extensive experience in the field of artificial intelligence and machine learning.",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/4/41/Peter_Norvig_Wikipedia.jpg",
      },
    ],
    coverImage:
      "https://m.media-amazon.com/images/I/61nHC3YWZlL._AC_UF1000,1000_QL80_.jpg",
    status: "NOT_AVAILABLE",
    id: "3",
    description:
      "This book is the leading textbook in AI, offering the most comprehensive, up-to-date introduction to the theory and practice of artificial intelligence.",
    edition: "4",
    releaseYear: "2020",
    count: 1,
    category: "125",
    history: [],
  },
  {
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    authors: [
      {
        id: "author5",
        name: "Erich Gamma",
        bio: "Erich Gamma is a Swiss software engineer and co-author of 'Design Patterns.' He is known for his work on the Eclipse IDE and JUnit.",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/1/1a/Erich_Gamma.jpg",
      },
      {
        id: "author6",
        name: "Richard Helm",
        bio: "Richard Helm is an Australian software engineer who co-authored the influential book 'Design Patterns' and has made significant contributions to the field of object-oriented software development.",
        image: "https://example.com/richard-helm.jpg",
      },
      {
        id: "author7",
        name: "Ralph Johnson",
        bio: "Ralph Johnson is a computer scientist and co-author of 'Design Patterns.' He has been instrumental in the development of object-oriented programming and software design.",
        image: "https://example.com/ralph-johnson.jpg",
      },
      {
        id: "author8",
        name: "John Vlissides",
        bio: "John Vlissides was a software engineer and co-author of 'Design Patterns.' His work had a lasting impact on software engineering, especially in the area of design patterns.",
        image: "https://example.com/john-vlissides.jpg",
      },
    ],
    coverImage:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQU7cibsp4SgjCTWm9MvARr2yzAlVvjqeaOWhfjaUdEkvehmPSwnTuouO89AWvwBtelrEA&usqp=CAU",
    status: "RESERVED_BY_ME",
    id: "4",
    description:
      "This book describes simple and elegant solutions to specific problems in object-oriented software design.",
    edition: "1",
    releaseYear: "1994",
    reservedBy: {
      id: "user2",
      firstName: "Jane",
      lastName: "Smith",
      email: "jane.smith@example.com",
      image: "https://example.com/jane-smith.jpg",
      history: [],
    },
    count: 1,
    category: "126",
    history: [],
  },
  {
    title: "The Pragmatic Programmer: Your Journey to Mastery",
    authors: [
      {
        id: "author9",
        name: "Andrew Hunt",
        bio: "Andrew Hunt is a software engineer and author known for his work on the book 'The Pragmatic Programmer.' He has extensive experience in software development and is a co-founder of the Pragmatic Bookshelf.",
        image: "https://example.com/andrew-hunt.jpg",
      },
      {
        id: "author10",
        name: "David Thomas",
        bio: "David Thomas is a software engineer and author, co-author of 'The Pragmatic Programmer,' and a co-founder of the Pragmatic Bookshelf. He has a background in software development and project management.",
        image: "https://example.com/david-thomas.jpg",
      },
    ],
    coverImage: "https://m.media-amazon.com/images/I/41as+WafrFL._SL500_.jpg",
    status: "RESERVED_BY_OTHERS",
    id: "5",
    description:
      "The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process.",
    edition: "2",
    releaseYear: "2019",
    reservedBy: {
      id: "user3",
      firstName: "Emily",
      lastName: "Brown",
      email: "emily.brown@example.com",
      image: "https://example.com/emily-brown.jpg",
      history: [],
    },
    count: 1,
    category: "127",
    history: [],
  },
];
