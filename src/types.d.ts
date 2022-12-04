export type Task = {
  fullyCompleted: boolean;
  due: Date;
  start: Date;
  scheduled: Date;
  text: string;
}

export type Page = {
  file: {
    name: string;
    tasks: Task[];
    link: {
      path: string;
    }
  }
  image: string,
  background: string,
}

declare module "obsidian" {
  interface App {
    plugins: {
      plugins: {
        dataview: {
          api: {
            pages: (path: string) => Page[];
          },
        };
      };
    };
  }
}