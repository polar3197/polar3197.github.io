// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-blog",
          title: "blog",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/blog/";
          },
        },{id: "nav-gallery",
          title: "gallery",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/gallery/";
          },
        },{id: "nav-creative-writing",
          title: "creative writing",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/creative/";
          },
        },{id: "post-second-hurdle-of-my-spark-adventure-spark-executors",
      
        title: "Second Hurdle of My Spark Adventure: Spark executors",
      
      description: "setup part 2: Spark! IP! Executors! Drivers!",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/three";
        
      },
    },{id: "post-dice",
      
        title: "Dice",
      
      description: "part 1, scene 2",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/Dice/";
        
      },
    },{id: "post-pink-hills",
      
        title: "Pink Hills",
      
      description: "part 1, scene 1",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/rosy-hills/";
        
      },
    },{id: "post-percy-39-s-rebellion",
      
        title: "Percy&#39;s Rebellion",
      
      description: "part 2, scene 7",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/percys-rebellion/";
        
      },
    },{id: "post-i-love-tmux",
      
        title: "I love tmux",
      
      description: "and I&#39;m such a newb at it",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/2025/tmux/";
        
      },
    },{id: "post-first-hurdle-of-my-spark-adventure-docker-containers",
      
        title: "First Hurdle of My Spark Adventure: Docker containers",
      
      description: "setup part 2: Docker! Docker-Compose!",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/two";
        
      },
    },{id: "post-rpi-setup",
      
        title: "RPi Setup",
      
      description: "setup part 1: Ethernet! IP addresses! SSH!",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/one";
        
      },
    },{id: "post-my-spark-adventure",
      
        title: "My Spark Adventure",
      
      description: "project overview",
      section: "Posts",
      handler: () => {
        
          window.location.href = "/blog/overview";
        
      },
    },{id: "projects-project-2",
          title: 'project 2',
          description: "a project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/2_project/";
            },},{id: "projects-project-3-with-very-long-name",
          title: 'project 3 with very long name',
          description: "a project that redirects to another website",
          section: "Projects",handler: () => {
              window.location.href = "/projects/3_project/";
            },},{id: "projects-project-4",
          title: 'project 4',
          description: "another without an image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/4_project/";
            },},{id: "projects-project-5",
          title: 'project 5',
          description: "a project with a background image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/5_project/";
            },},{id: "projects-project-6",
          title: 'project 6',
          description: "a project with no image",
          section: "Projects",handler: () => {
              window.location.href = "/projects/6_project/";
            },},{id: "projects-project-8",
          title: 'project 8',
          description: "an other project with a background image and giscus comments",
          section: "Projects",handler: () => {
              window.location.href = "/projects/8_project/";
            },},{id: "projects-project-9",
          title: 'project 9',
          description: "another project with an image 🎉",
          section: "Projects",handler: () => {
              window.location.href = "/projects/9_project/";
            },},{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
