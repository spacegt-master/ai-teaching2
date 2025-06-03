import { useIntervalFn } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";

const unityInstance = ref<any>();

const loaded = ref(false);

/**
 * speaker 声音角色 字符串
    speaker 列表
    "zh-CN-XiaoxiaoNeural",           女
    "zh-CN-XiaoyiNeural",             女
    "zh-CN-YunxiaNeural",             女
    "zh-CN-YunjianNeural",            男
    "zh-CN-YunxiNeural",              男
    "zh-CN-YunyangNeural",            男
    "zh-CN-liaoning-XiaobeiNeural",
    "zh-CN-shaanxi-XiaoniNeural",
    "zh-HK-HiuGaaiNeural",
    "zh-HK-HiuMaanNeural",
    "zh-HK-WanLungNeural",
    "zh-TW-HsiaoChenNeural",
    "zh-TW-HsiaoYuNeural",
    "zh-TW-YunJheNeural",
 */

//PushWord("这是一段测试语音","zh-CN-XiaoxiaoNeural",0,0,0) 使用 女 小小

//voloum  音量        整形         范围 -100 ~ 100
//rate    说话速率    整形         范围 -100 ~ 100
//pitch   音调        整形         范围 -100 ~ 100
//默认使用  云熙声音  男性
function PushWord(
  audioText: string,
  speaker: string,
  volume: number,
  rate: number,
  pitch: number
) {
  var values =
    audioText + "丿" + speaker + "丿" + volume + "丿" + rate + "丿" + pitch;
  unityInstance.value.SendMessage("WebCom", "PushWord", values);
}

//默认使用  云熙声音  男性
function PushLongText(audioText: string) {
  unityInstance.value.SendMessage("WebCom", "PushText", audioText);
}

//PushTextByProperty("这是一段测试语音","zh-CN-XiaoxiaoNeural",0,0,0)
function PushTextByProperty(
  audioText: string,
  speaker: string,
  volume: number,
  rate: number,
  pitch: number
) {
  var values =
    audioText + "丿" + speaker + "丿" + volume + "丿" + rate + "丿" + pitch;
  unityInstance.value.SendMessage("WebCom", "PushTextByProperty", values);
}

function StopAudio() {
  unityInstance.value.SendMessage("WebCom", "StopAudio");
}
// SetBackPanelColor('#FF0000')
function SetBackPanelColor(color: string) {
  if (unityInstance.value)
    unityInstance.value.SendMessage("WebCom", "SetBackPanelColor", color);
}
// ShowBackPanel('true')
function ShowBackPanel(show: string) {
  if (unityInstance.value)
    unityInstance.value.SendMessage("WebCom", "ShowBackPanel", show);
}

const regex = /,|\.|\?|!|:|;|，|。|？|！|：|；/;

export const useModelStore = defineStore("model", () => {
  let draftBuffer = ref("");

  useIntervalFn(() => {
    if (draftBuffer.value) {
      const reg = regex.exec(draftBuffer.value);

      if (reg && reg.index > -1 && loaded.value) {
        PushWord(
          draftBuffer.value.substring(0, reg.index),
          "zh-CN-XiaoxiaoNeural",
          0,
          0,
          0
        );
        draftBuffer.value = draftBuffer.value.substring(
          reg.index + 1,
          draftBuffer.value.length
        );
      }
    }
  }, 100);

  return {
    unityInstance,
    loaded,
    draftBuffer,
    PushWord,
    PushLongText,
    PushTextByProperty,
    StopAudio,
    SetBackPanelColor,
    ShowBackPanel,
  };
});
