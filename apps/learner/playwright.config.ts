import {defineConfig,devices} from "@playwright/test";

export default defineConfig({
  testDir:"./tests",
  timeout:20000,
  expect:{timeout:7000},
  use:{baseURL:"http://127.0.0.1:5179",trace:"retain-on-failure"},
  projects:[
    {name:"desktop-chromium",use:{...devices["Desktop Chrome"]}},
    {name:"mobile-chromium",use:{...devices["Pixel 7"]}}
  ],
  webServer:{
    command:"npm run dev",
    url:"http://127.0.0.1:5179",
    reuseExistingServer:!process.env.CI,
    timeout:60000
  }
});
