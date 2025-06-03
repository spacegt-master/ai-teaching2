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

const app = "智能网联汽车技术";

const title = "Hi，同学你好，我是你的 24 小时 AI 助教。";

const description =
  "有任何智能网联汽车技术相关问题，你都可以通过文字或者语音向我提问，我将用我丰富的知识库和敏锐的洞察力为您解答相关知识，我会让我们的交流充满智慧和乐趣~";

const defaultConversationsItems = [
  {
    key: "0",
    label: "什么是智能网联汽车技术?",
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
        description: `自动驾驶技术加速成熟与落地`,
      },
      {
        key: "1-2",
        description: `车路云一体化协同发展`,
      },
      {
        key: "1-3",
        description: `软件定义汽车与智能座舱`,
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
        description: `安全性设计（Safety by Design）`,
      },
      {
        key: "2-2",
        icon: h(SmileOutlined),
        description: `运行设计域 (Operational Design Domain, ODD) `,
      },
      {
        key: "2-3",
        icon: h(CommentOutlined),
        description: `人机交互 (Human-Machine Interaction, HMI) `,
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
