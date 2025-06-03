import type { PromptsProps } from "ant-design-x-vue";
import type { VNode } from "vue";
import { defineStore } from "pinia";
import { h } from "vue";
import { Space } from "ant-design-vue";
import {
  CommentOutlined,
  FireOutlined,
  HeartOutlined,
  ReadOutlined,
  SmileOutlined,
} from "@ant-design/icons-vue";

const app = "园林设计";

const title = "Hi，同学你好，我是你的 24 小时 AI 助教。";

const description =
  "有任何园林设计相关问题，你都可以通过文字或者语音向我提问，我将用我丰富的知识库和敏锐的洞察力为您解答相关知识，我会让我们的交流充满智慧和乐趣~";

const defaultConversationsItems = [
  {
    key: "0",
    label: "什么是园林设计?",
  },
];

const placeholderPromptsItems: PromptsProps["items"] = [
  {
    key: "1",
    label: renderTitle(
      h(FireOutlined, { style: { color: "#FF4D4F" } }),
      "热门话题"
    ),
    description: "你对什么感兴趣?",
    children: [
      {
        key: "1-1",
        description: `智能园林与智慧管理`,
      },
      {
        key: "1-2",
        description: `城市生物多样性景观设计`,
      },
      {
        key: "1-3",
        description: `城市农业与食物景观`,
      },
    ],
  },
  {
    key: "2",
    label: renderTitle(
      h(ReadOutlined, { style: { color: "#1890FF" } }),
      "设计指南"
    ),
    description: "如何设计一款优质的产品?",
    children: [
      {
        key: "2-1",
        icon: h(HeartOutlined),
        description: `设计元素：景观与花园`,
      },
      {
        key: "2-2",
        icon: h(SmileOutlined),
        description: `生态景观设计：原理与应用`,
      },
      {
        key: "2-3",
        icon: h(CommentOutlined),
        description: `景观设计手绘表现技法`,
      },
    ],
  },
];

const senderPromptsItems: PromptsProps["items"] = [
  {
    key: "1",
    description: "热门话题",
    icon: h(FireOutlined, { style: { color: "#FF4D4F" } }),
  },
  {
    key: "2",
    description: "设计指南",
    icon: h(ReadOutlined, { style: { color: "#1890FF" } }),
  },
  {
    key: "3",
    description: "长方体正等轴测图绘制过程是什么",
  },
];

function renderTitle(icon: VNode, title: string) {
  return h(Space, { align: "start" }, () => [icon, h("span", title)]);
}

export default defineStore("data", () => {
  return {
    app,
    title,
    description,
    defaultConversationsItems,
    placeholderPromptsItems,
    senderPromptsItems,
  };
});
