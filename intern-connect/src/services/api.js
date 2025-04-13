import lgLogo from '../../src/images/lglogo.png'
import fptLogo from '../../src/images/fpt.jpg'
import nvLogo from '../../src/images/nvidialogo.png'

// export const fetchStudentProfile = async () => {
//   return {
//     name: "Nguyễn Đức",
//     studentId: "21T1020310",
//     status: "Thực tập",
//     email: "tbnduc2k3@gmail.com",
//     address: "26 Lê Trung Định, Đà Nẵng",
//     phone: "0786490209",
//     birthday: "06/01/2003",
//     gender: "Nam",
//     introduction:
//       "Final-year Software Engineering student at the University of Sciences, Hue University.",
//     education: [
//       {
//         institution: "University of Sciences, Hue University",
//         details: "Final-year student majoring in Software Engineering.",
//       },
//     ],
//     otherInfo: {
//       github: "https://github.com/BeDauPro",
//       gpa: "2.6",
//       languages: "Tiếng Việt, Tiếng Anh",
//     },
//     skills: ["ASP.NET", "ReactJS", "Flutter", "SQL Server", "Figma"],
//     cvUploaded: false,
//   };
// };

export const fetchEmployerProfile = async () => {
  return {
    companyName: "FPT Software",
    companyID: "fpt123",
    companyEmail: "contact@fptsoftware.com",
    addresscom: "Hà Nội, Việt Nam",
    phone: "+84-24-7300-7300",
    website: "https://www.fpt-software.com",
    since: "1999",
    totalEmployee: "27000",
    introduction:
      "FPT Software is a leading IT services provider in Southeast Asia, specializing in digital transformation, software development, and IT outsourcing.",
    services: [
      "Digital Transformation Consulting",
      "Cloud Migration",
      "AI & Data Analytics",
      "Software Development",
      "Managed Services",
    ],
  };
};

export const fetchJobDetails = async () => {
  return {
    companyName: "FPT Software",
    location: "Hà Nội, Việt Nam",
    field: "Information Technology",
    jobTitle: "Software Engineer Intern",
    jobType: "Full-time",
    salary: "1,000,000 - 3,000,000 VND",
    experience: "No experience required",
    jobDescription:
      "Assist in developing and maintaining software applications. Collaborate with the team to deliver high-quality solutions.",
    jobRequirements:
      "Basic knowledge of programming languages such as Java, Python, or C#. Good problem-solving skills.",
    languages: ["English", "Vietnamese"],
    vacancies: 5,
    deadline: "2023-12-31",
  };
};

export const fetchApplications = async () => {
  return [
    {
      id: '123',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      dateRange: '21/2/2025',
      status: 'Chờ phản hồi',
    },
    {
      id: '124',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      dateRange: '25/2/2025',
      status: 'Phỏng vấn',
    },
    {
      id: '125',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      dateRange: '29/2/2025',
      status: 'Thực tập',
    },
    {
      id: '126',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      dateRange: '23/2/2025',
      status: 'Hoàn thành',
    },
    {
      id: '1234',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      dateRange: '21/2/2025',
      status: 'Chờ phản hồi',
    },
    {
      id: '1243',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      dateRange: '25/2/2025',
      status: 'Phỏng vấn',
    },
    {
      id: '1252',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      dateRange: '29/2/2025',
      status: 'Thực tập',
    },
    {
      id: '1261',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      dateRange: '23/2/2025',
      status: 'Hoàn thành',
    },
    {
      id: '1239',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      dateRange: '21/2/2025',
      status: 'Chờ phản hồi',
    },
    {
      id: '1248',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      dateRange: '25/2/2025',
      status: 'Phỏng vấn',
    },
    {
      id: '1257',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      dateRange: '29/2/2025',
      status: 'Thực tập',
    },
    {
      id: '1266',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      dateRange: '23/2/2025',
      status: 'Hoàn thành',
    },
  ];
};

export const fetchJobs = async () => {
  return [
    {
      id: 1,
      title: "Flutter",
      company: "FPT Software",
      location: "Đà Nẵng",
      type: "Part-time",
      typeClass: "partTime",
      logo: fptLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 2,
      title: "ReactJS",
      company: "LG Company",
      location: "Huế",
      type: "Part-time",
      typeClass: "partTime",
      logo: lgLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 3,
      title: "Full-stack",
      company: "NVIDIA Company",
      location: "Hà Nội",
      type: "Full-time",
      typeClass: "fullTime",
      logo: nvLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 4,
      title: "Flutter",
      company: "FPT Software",
      location: "Đà Nẵng",
      type: "Part-time",
      typeClass: "partTime",
      logo: fptLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 5,
      title: "ReactJS",
      company: "LG Company",
      location: "Huế",
      type: "Part-time",
      typeClass: "partTime",
      logo: lgLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 6,
      title: "Full-stack",
      company: "NVIDIA Company",
      location: "Hà Nội",
      type: "Full-time",
      typeClass: "fullTime",
      logo: nvLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 7,
      title: "Flutter",
      company: "FPT Software",
      location: "Đà Nẵng",
      type: "Part-time",
      typeClass: "partTime",
      logo: fptLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 8,
      title: "ReactJS",
      company: "LG Company",
      location: "Huế",
      type: "Part-time",
      typeClass: "partTime",
      logo: lgLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 9,
      title: "Full-stack",
      company: "NVIDIA Company",
      location: "Hà Nội",
      type: "Full-time",
      typeClass: "fullTime",
      logo: nvLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 10,
      title: "Flutter",
      company: "FPT Software",
      location: "Đà Nẵng",
      type: "Part-time",
      typeClass: "partTime",
      logo: fptLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 21,
      title: "ReactJS",
      company: "LG Company",
      location: "Huế",
      type: "Part-time",
      typeClass: "partTime",
      logo: lgLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 31,
      title: "Full-stack",
      company: "NVIDIA Company",
      location: "Hà Nội",
      type: "Full-time",
      typeClass: "fullTime",
      logo: nvLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 112,
      title: "Flutter",
      company: "FPT Software",
      location: "Đà Nẵng",
      type: "Part-time",
      typeClass: "partTime",
      logo: fptLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 32,
      title: "ReactJS",
      company: "LG Company",
      location: "Huế",
      type: "Part-time",
      typeClass: "partTime",
      logo: lgLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 3121,
      title: "Full-stack",
      company: "NVIDIA Company",
      location: "Hà Nội",
      type: "Full-time",
      typeClass: "fullTime",
      logo: nvLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 141,
      title: "Flutter",
      company: "FPT Software",
      location: "Đà Nẵng",
      type: "Part-time",
      typeClass: "partTime",
      logo: fptLogo,
      quantity: 10,
      date: "5/3/2025",
    },
    {
      id: 243,
      title: "ReactJS",
      company: "LG Company",
      location: "Huế",
      type: "Part-time",
      typeClass: "partTime",
      logo: lgLogo,
      quantity: 10,
      date: "5/3/2025",
    },
  ];
};

export const fetchEvents = async () => {
  return [
    {
      id: 1,
      title: "Talkshow với chuyên gia AI Trương Đức...",
      location: "Hội trường A1, Đại Học Khoa Học Huế",
      organizer: "Nguyễn Hoàng Hà",
      date: "2025-12-12",
      content: "AI (artificial intelligence) – Trí tuệ nhân tạo hay trí thông minh nhân tạo có thể được định nghĩa như một ngành của khoa học máy tính liên quan đến việc tự động hóa các hành vi thông minh, hay được hiểu như là trí tuệ của máy móc được tạo ra bởi con người"
    },
    {
      id: 2,
      title: "Kiến tập tại công ty phần mềm FPT lớn nhất miền trung",
      location: "FPT Software Complex, Đà Nẵng",
      organizer: "Nguyễn Hoàng Hà",
      date: "2025-12-12",
      content: "Nhằm giúp sinh viên tiếp cận với môi hình sản xuất phần mềm thực tế của doanh nghiệp, bước đầu làm quen với quy trình phát triển phần mềm, Khoa Công nghệ số – Trường Đại học Khoa học Huế tổ chức cho các sinh viên ngành Công nghệ Thông tin khóa 2022 và 2023 tham gia kiến tập tại Công ty FPT Software Đà Nẵng. Nhằm giúp sinh viên tiếp cận với môi hình sản xuất phần mềm thực tế của doanh nghiệp, đồng thời rèn luyện những kỹ năng, kiến thức cần thiết để có môi trường việc trong tương lai, ngày 15/02/2025. Khoa Công nghệ số – Trường Đại học Khoa học Huế tổ chức cho các sinh viên ngành Công nghệ Thông tin khóa 2022 và 2023 tham gia kiến tập tại Công ty FPT Software Đà Nẵng."
    },
    {
      id: 3,
      title: "Gặp mặt cựu sinh viên là tổng giám đốc công ty...",
      location: "Hội trường A1, Đại Học Khoa Học Huế",
      organizer: "Nguyễn Hoàng Hà",
      date: "2025-12-12",
      content: "AI (artificial intelligence) – Trí tuệ nhân tạo hay trí thông minh nhân tạo có thể được định nghĩa như một ngành của khoa học máy tính liên quan đến việc tự động hóa các hành vi thông minh, hay được hiểu như là trí tuệ của máy móc được tạo ra bởi con người"
    },
  ]
}

export const fetchReview = async () => {
  return [
    {
      company: "FPT Software",
      overallScore: "10/10",
      reviewText: "Có chí tiến thủ, siêng năng, cầu tiến và luôn hoàn thành task đúng thời hạn. Tiếp tục phát huy tinh thần và chuẩn bị thật kỹ kiến thức để phỏng vấn vào vị trí fresher sắp tới em nhé."
    }
  ]
}

export const fetchEmployerReview = async () => {
  return [
    {
      name: 'Nguyen Đuc',
      text: 'Các anh chị mentor rất thân thiện, hướng dẫn, chỉ dạy nhiệt tình, chu đáo. Xứng đáng là môi trường thực tập tốt nhất Việt Nam.',
      rating: 5,
      imgSrc: 'https://storage.googleapis.com/a1aa/image/D91cQhagVVi70nxKj8yih2EgR5Y7PzOgVo0tO_t2sfE.jpg',
    },
    {
      name: 'Sơn Tùng MTP',
      text: 'Các anh chị mentor rất thân thiện, hướng dẫn, chỉ dạy nhiệt tình, chu đáo. Xứng đáng là môi trường thực tập tốt nhất Việt Nam.',
      rating: 3,
      imgSrc: 'https://storage.googleapis.com/a1aa/image/9do6e4N20k9FQ_tBwb-0jV1l1B62dv4NnlCzp6lIko8.jpg',
    },
  ]
}

export const fetchApplicationEmployer = async () => {
  return [
    {
      id: '123',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      student: 'Nguyễn Đức',
      date: '26/2/2025',
      status: 'Chờ phản hồi'
    },
    {
      id: '312',
      position: 'Java Back-end',
      company: 'Viettel',
      student: 'Minh Toàn',
      date: '26/1/2025',
      status: 'Phỏng vấn'
    },
    {
      id: '125',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      student: 'Trần Hoa',
      date: '20/2/2025',
      status: 'Thực tập'
    },
    {
      id: '126',
      position: 'React Developer',
      company: 'LG Company',
      student: 'Lê Minh',
      date: '15/2/2025',
      status: 'Hoàn thành'
    },
    {
      id: '1236',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      student: 'Nguyễn Đức',
      date: '26/2/2025',
      status: 'Chờ phản hồi'
    },
    {
      id: '3162',
      position: 'Java Back-end',
      company: 'Viettel',
      student: 'Minh Toàn',
      date: '26/1/2025',
      status: 'Phỏng vấn'
    },
    {
      id: '1995',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      student: 'Trần Hoa',
      date: '20/2/2025',
      status: 'Thực tập'
    },
    {
      id: '1026',
      position: 'React Developer',
      company: 'LG Company',
      student: 'Lê Minh',
      date: '15/2/2025',
      status: 'Hoàn thành'
    },
    {
      id: '1283',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      student: 'Nguyễn Đức',
      date: '26/2/2025',
      status: 'Chờ phản hồi'
    },
    {
      id: '382',
      position: 'Java Back-end',
      company: 'Viettel',
      student: 'Minh Toàn',
      date: '26/1/2025',
      status: 'Phỏng vấn'
    },
    {
      id: '1205',
      position: 'Flutter Mobile App Intern',
      company: 'FPT Software',
      student: 'Trần Hoa',
      date: '20/2/2025',
      status: 'Thực tập'
    },
    {
      id: '1256',
      position: 'React Developer',
      company: 'LG Company',
      student: 'Lê Minh',
      date: '15/3/2025',
      status: 'Hoàn thành'
    },
  ];
};

export const fetchAccountManagement = async () => {
  return [
    {
      username: "admin1",
      email: "admin1@example.com",
      password: "password123",
      createdAt: "2023-01-01",
    },
    {
      username: "admin2",
      email: "admin2@example.com",
      password: "password456",
      createdAt: "2023-02-15",
    },
    {
      username: "admin3",
      email: "admin3@example.com",
      password: "password789",
      createdAt: "2023-03-10",
    },
    {
      username: "admin4",
      email: "admin4@example.com",
      password: "password321",
      createdAt: "2023-04-20",
    },
    {
      username: "admin5",
      email: "admin1@example.com",
      password: "password123",
      createdAt: "2023-01-01",
    },
    {
      username: "admin6",
      email: "admin2@example.com",
      password: "password456",
      createdAt: "2023-02-15",
    },
    {
      username: "admin7",
      email: "admin3@example.com",
      password: "password789",
      createdAt: "2023-03-10",
    },
    {
      username: "admin8",
      email: "admin4@example.com",
      password: "password321",
      createdAt: "2023-04-20",
    },
    {
      username: "admin9",
      email: "admin1@example.com",
      password: "password123",
      createdAt: "2023-01-01",
    },
    {
      username: "admin10",
      email: "admin2@example.com",
      password: "password456",
      createdAt: "2023-02-15",
    },
    {
      username: "admin11",
      email: "admin3@example.com",
      password: "password789",
      createdAt: "2023-03-10",
    },
    {
      username: "admin12",
      email: "admin4@example.com",
      password: "password321",
      createdAt: "2023-04-20",
    },
  ];
};