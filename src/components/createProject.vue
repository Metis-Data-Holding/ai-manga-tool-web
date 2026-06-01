<template>
  <view class="mark" style="justify-content:center;z-index: 12;">
    <view
      style="background: #ffffff;display: flex;flex-direction: column;justify-content: flex-start;align-items: center;padding: 48rpx;border-radius: 24rpx;">
      <view style="width: 100%;display: flex;flex-direction: row;justify-content: center;align-items: center;">
        <text style="font-size: 48rpx;font-weight: bold;color: #FFA600;">新建项目</text>
      </view>
      <view
        style="display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start;margin-top: 40rpx;">
        <view style="display: flex;flex-direction: row;align-items: center;">
          <image src="/static/proNameIcon.png" style="width: 32rpx;height: 32rpx;margin-right: 16rpx;"></image>
          <text style="font-size: 32rpx;font-weight: 500;">项目名称<text style="color: #FF0000;">*</text></text>
        </view>
        <input @input="NameInput" class="sp-input" style="width: 760rpx;height: 80rpx;" :value="state.projectName"
          placeholder="请输入项目名称" />
      </view>
      <view
        style="display: flex;flex-direction: column;justify-content: flex-start;align-items: flex-start;margin-top: 40rpx;width: 100%;">
        <view style="display: flex;flex-direction: row;align-items: center;">
          <image src="/static/proNameIcon.png" style="width: 32rpx;height: 32rpx;margin-right: 16rpx;"></image>
          <text style="font-size: 32rpx;font-weight: 500;">项目模式<text style="color: #FF0000;">*</text></text>
        </view>
        <view
          style="display: flex;flex-direction: row;align-items: center; margin-top: 16rpx;justify-content: space-between;width: 100%;">
          <button @click="changeType(1)" :class="state.projectType == 1 ? 'modalactive' : 'modalnormal'">多参流程</button>
          <button @click="changeType(2)" :class="state.projectType == 2 ? 'modalactive' : 'modalnormal'">图生流程</button>
        </view>
      </view>

      <view style="margin-top: 40rpx;">
        <view style="display: flex;flex-direction: row;align-items: center;">
          <image src="/static/proDetaiIcon.png" style="width: 32rpx;height: 32rpx;margin-right: 16rpx;"></image>
          <text style="font-size: 32rpx;font-weight: 500;">项目简介</text>
        </view>
        <textarea :maxlength="-1" @input="DetailInput" class="sp-input"
          style="width: 760rpx;height: 204rpx;margin-top: 20rpx;" :value="state.projectDetail"
          placeholder="输入项目简介"></textarea>
      </view>

      <view
        style="display: flex;flex-direction: row;width: 80%;justify-content: space-between;align-items: center;margin-top: 24rpx;">
        <button @click="closeEditor" class="buttonc">取消</button>
        <button @click="createProject" class="buttonc" style="background: #FFA600;color: #FFFFFF;">创建</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { defineProps, defineEmits, reactive, onMounted, ref, onUnmounted } from 'vue'
import { CreateProject } from '../common/ProjectMgr';
import { isNull } from '../common/Tool';
import { useStore } from 'vuex';

const store = useStore()

const props = defineProps({

})
const emits = defineEmits(["close", "createSucceed"])

const state = reactive({
  projectName: '',
  projectDetail: '',
  projectType: 1
})

function NameInput(e) {
  state.projectName = e.detail.value
}

function DetailInput(e) {
  state.projectDetail = e.detail.value
}

function closeEditor() {
  emits('close', {})
}

function changeType(type) {
  state.projectType = type
}

function createProject() {
  if (isNull(state.projectName)) {
    uni.showToast({
      title: '请输入项目名称',
      icon: 'none'
    })
    return
  }

  const projectConfig = {
    // 对应项目资产
    pictureConfig: {
      "defaultModel": "13",
      "modelList": [],
      "defaultNum": 1,
      "numList": [],
      "defaultFrame": "16:9",
      "frameList": [],
      "defaultResolution": "2K",
      "resolutionList": [],
      "hfSpId": "",
      "hfSp": "",
      "rtSpId": "",
      "rtSp": "",
      "fxSpId": "",
      "fxSp": "",
      "promptSpId": "", //生图提示词sp 2026-2-25新增
      "promptSp": "", //生图提示词sp的内容 2026-2-25新增
      "promptDefaultModel": "", //生图提示词默认模型 2026-2-25新增
      "promptModelList": [], //生图提示词模型列表 2026-2-25新增
    },
    // 对应故事板
    videoConfig: {
      "defaultModel": "17",
      "modelList": [],
      "defaultNum": "",
      "numList": [],
      "defaultFrame": "9:16",
      "frameList": [],
      "defaultResolution": "480P",
      "resolutionList": [],
      "rtSpId": "",
      "rtSp": "",
      "fxSpId": "",
      "fxSp": ""
    },
    // 对应分集剧本
    txtConfig: {
      "createEpisodes": {
        "defaultModel": "",
        "modelList": [],
        "spId": "",
        "sp": ""
      },
      "createAssets": {
        "defaultModel": "",
        "modelList": [],
        "spId": "",
        "sp": ""
      },
      "createEvaluate": {
        "defaultModel": "",
        "modelList": [],
        "spId": "",
        "sp": ""
      },
      "storyboard": {
        "defaultModel": "6",
        "modelList": [],
        "spId": 1488,
        "sp": `【核心铁则】（全程刚性执行）\n1.对白内容核心保留、非对白内容灵活适配\n2.剧本对白内容核心信息 100% 保留，可微调语气适配表演节奏，无关键对话遗漏 / 删改\n3.剧本非对白叙述内容可精简、润色或重构，无核心情节、人物设定、场景逻辑的遗漏\n4.整体内容中对白占比≥50%，弱化旁白叙事，强化角色表演与对白演绎\n5.角色、场景、道具的名称，必须严格从 {assetListContent} 中提取，准确匹配，不得自行创编或修改\n【任务目标】\n你是一名专业的 AI 演绎剧分镜师与影视化表演编导，核心任务是在核心保留剧本对白内容（占比≥50%）、非对白内容灵活适配且无关键情节遗漏的前提下，生成 AI 演绎剧的分镜列表，画面内容为原文情节的表演化视觉落地，强化角色互动、表演动作与情绪表达的影视化呈现。\n【分拆规则】\n1. 核心刚性规则（对白核心保留，非对白灵活适配）\n - 内容保留原则：角色对白核心信息 100% 保留，可微调语气 / 句式适配影视表演节奏；非对白旁白可精简、润色、重构，仅做极简场景 / 情绪铺垫，不主导叙事\n - 语序逻辑原则：原文核心叙事逻辑、角色对白的先后顺序完全遵循原著，分镜拆分、镜头排布不改动剧情走向与对白互动逻辑\n2. 基础分镜规范\n - 镜头拆分：输入剧本按表演节奏拆分为 8-12 个分镜，每个分镜总时长控制在 12-15 秒，每个分镜下拆分 4-6个镜头（每个镜头时长 2-4 秒）\n - 单个镜头对白长度控制在不超10字，长对白适当分拆多种镜头类型\n - 叙事主线：以角色对白为核心演绎主线，旁白仅做极简的场景交代、情绪铺垫，不额外新增对白，不删减核心对白\n3. 内容适配规则（演绎化 + 影视化双结合，强化表演性）\n - 影视化视觉化：画面描述严格遵循 **「角色+动作/微表情 + 情景（环境变化）+ 情绪」** 的格式，强化角色的表演性与互动性\n - 镜头专业标注：每个镜头前方必须用【景别 + 运镜】标注，具体规范如下：\n  a.景别类型：大远景 / 远景 / 全景 / 中景 / 近景 / 特写 / 大特写 / 微距；对话 / 表演场景优先近景 / 特写，突出角色微表情与表演细节；角色情绪爆发、对白高光用特写 / 大特写；场景转换、环境交代用远景 / 全景（极简使用）\n  b.运镜类型：固定 / 反打 / 过肩 / 跟随 / 推近 / 拉远 / 手持 / 摇动 / 平移 / 上升 / 下降；对话 / 表演场景用固定 / 反打 / 过肩运镜，强化对白互动；人物移动用跟随运镜，表演细节聚焦用疾速推近运镜，可补充运镜方向与速度（如水平缓慢平移、疾速推近面部）\n  c.特殊运镜：高能剧情、情绪爆发、冲突戏可使用疾速追尾镜、情绪推镜、冲突穿梭镜等特殊运镜，强化表演的视觉冲击力与情绪感染力\n【旁白 & 对白音色】\n旁白：采用中性叙事画外音，仅做极简场景 / 情绪铺垫，占比≤40%，根据剧情极简注明情绪 / 语调，全程保持统一\n角色对白：采用人物专属音色，严格匹配角色性格与剧情情绪，详细标注表演性的语气 / 语调 / 情绪（如哽咽、怒斥、娇嗔、低声呢喃），强化演绎感\n【输出要求】\n1.全程适配参考生视频模式，清晰划分单分镜下的子镜头，便于 AI 自动完成分镜拆解与视频生成，镜头逻辑贴合影视表演观看习惯\n2.每个分镜内，对白内容核心保留（可微调语气适配表演），非对白旁白灵活精简 / 润色，画面提示词与角色表演动作、微表情一一绑定，无关键情节偏差，核心内容完整呈现\n3.旁白/独白/对白混合穿插的文本内容，分别需清晰标注好对应的音色和表演性的情绪/语气/语调，对白的情绪标注需更细致\n4.画面细节刻画精准：核心人物的表演动作、微表情、互动姿态，场景背景的环境细节，关键道具的呈现，均贴合原文描述，情绪表演、冲突画面的细节拉满，表演氛围感拉满\n5.镜头层次丰富：通过核心表演镜头、对白互动镜头、情绪反应镜头组合，极简搭配场景空镜，完整还原原文情节；场次切换时用极简空镜配合旁白交代场景变化，不占用表演镜头时长，可在长对白加入反应镜头、空镜头、说话人/听众的特写镜头等丰富表达\n6.每个分镜的最后一个镜头，需要与下一个分镜的首个镜头有衔接关系，符合逻辑\n7.镜头内容避免写清楚每一个出场角色（路人 / 群众除外），不能用统称或者代称，如：林先生和林太太缓慢从楼梯并肩走下来，不能写成 “林先生夫妇缓慢从楼梯并肩走下来”\n8.每个分镜必须标注完整时长，按镜头细化标注BGM风格/节奏和音效类型，BGM 适配角色表演节奏，音效强化表演氛围感，辅助 AI 生成更贴合演绎剧氛围的视频\n\n#【原文范例】\n我客客气气开口：“老板娘，能多添点香菜不？” 她抬眼扫过来，眼神跟尖刀似的：“添香菜，你当香菜不要钱啊？嫌少就别吃，门在那边。” 整间店里的人都朝我看过来，我这人没作声，安安静静吃完结了账，转身就走。\n【对应演绎剧分镜生视频提示词参考范例】\n时长：13 秒\n镜头 1:【中景 + 过肩】苏婉端碗走到收银台，身体微倾，语气谦和开口，面部带轻微期待\n对白（苏婉，谦和期待）：老板娘，能多添点香菜不？\n镜头 2:【特写 + 疾速推近】周小霞抬眼盯向苏婉，眼尾上挑，眉头骤皱，眼神尖锐带不耐\n镜头 3:【近景 + 反打】周小霞身体前倾，对着苏婉高声说话，嘴角下撇，神情凶厉呵斥\n对白（周小霞，不耐烦怒斥）：添香菜，你当香菜不要钱啊？嫌少就别吃，门在那边。\n镜头 4:【全景 + 缓慢平移】面馆内食客纷纷转头，目光看向苏婉与周小霞，面露好奇 / 围观神情\n旁白（中性，平淡）：店内食客纷纷看过来\n镜头 5:【近景 + 固定】苏婉抿紧嘴唇，头微低，眼神黯淡，面露尴尬又憋屈的神情，沉默不语\n镜头 6:【中景 + 跟随】苏婉低头默默吃面，动作缓慢，吃完后拿起手机点击支付，转身快步走出面馆，背影略显落寞\n旁白（中性，平淡）：苏婉沉默吃完结账，转身离开\nBGM 风格：轻柔低沉的纯音乐，贴合情绪节奏，音量随表演起伏\nBGM 节奏：前期平缓，周小霞呵斥时骤强，苏婉沉默时渐弱\n音效：周小霞呵斥声，食客窃窃私语声，手机支付提示音，脚步声\n\n【固定输出格式】\n####\n——————————————\n###\n分镜编号：1\n分镜内容：（核心信息10-12字）\n角色：\n场景：\n道具：\n氛围光线：\n情绪基调：\n###\n（分镜生视频提示词内容）\n####\n——————————————\n###\n分镜编号：2\n分镜内容：（核心信息10-12字）\n角色：\n场景：\n道具：\n氛围光线：\n情绪基调：\n###\n（分镜生视频提示词内容）\n####\n——————————————\n###\n分镜编号：3\n......\n（后续编号分镜保持分镜1和2结构输出每个分镜内容）`,
      },
      "videoReverse": {
        "defaultModel": "",
        "modelList": [],
        "spId": "",
        "sp": ""
      }
    },
    rtConfig:{
      frame:'9:16',
      model:'9',
      num:1,
      resolution:'1K',
      sp:'',
      spId:'',
    }
  }

  if(state.projectType==2){
    projectConfig.videoConfig.defaultModel = '4';
    projectConfig.videoConfig.defaultResolution = '720P';
    projectConfig.txtConfig.storyboard.spId = 1886;
    projectConfig.txtConfig.storyboard.sp = `#核心铁则（全程刚性执行）：\n**输入剧本原文一字不差、100%完整保留**\n1.原文全部文字必须全部出现分拆在旁白和对白内容中\n2.原文所有文字内容无任何内容遗漏/删改\n\n#【任务目标】\n你是一名专业的AI解说漫剧分镜师与影视化视觉编导，核心任务是在100%保留输入剧本原文所有文字、零改动无遗漏的前提下，生成AI解说剧的分镜列表，画面内容为原文情节的视觉化落地\n\n【分拆规则】\n1. 核心刚性规则（原文零改动）\n- 旁白/对白文字保留：旁白和对白的内容100%截取原文对应文字，不做任何替换、增删、缩写、扩写\n- 语序绝对不变：原文内容的先后顺序完全遵循原著，分镜拆分、镜头排布均不改动原文叙事逻辑与语句顺序\n2. 基础分镜规范\n- 镜头拆分：输入原文按叙事节奏拆分为20-30分镜，每个分镜总时长控制在4-6秒\n- 叙事主线：以原文叙述文字转化的旁白为核心叙事主线，角色对白仅截取原文原有对话，不额外新增对话、不删减原有对话\n3. 内容适配规则（解说化+影视化双结合）\n- 解说化适配：将原文进行分段，每个分镜配合10-40字的旁白（含对白）内容\n- 影视化视觉化：画面描述严格遵循“动作/表情+情景（环境变化）+情绪”的格式\n- 镜头专业标注：每个分镜融图提示词主体内容的前方必须用【景别+运镜】标注，具体规范如下：\n  - 景别类型：大远景/远景/全景/中景/近景/特写/大特写/微距，对话场景优先中景/近景，角色表情、情绪爆发、细节高光用特写/大特写，场景转换、环境交代用远景/全景\n  - 运镜类型：固定/反打/过肩/跟随/推近/拉远/手持/摇动/平移/上升/下降，对话场景用固定运镜，人物移动、动作戏用跟随运镜，细节聚焦用推近运镜，可补充运镜方向与速度（如水平缓慢平移、疾速推近）\n  - 特殊运镜：高能剧情、打斗戏、特效场面可使用疾速追尾镜、打斗穿梭镜、飞跃俯冲镜等特殊运镜，大幅提升视觉冲击力\n【旁白音色】\n- 统一采用第一主角音色的独白画外音作为旁白，并根据剧情注明情绪/语气/语调，旁白音色保持唯一且统一\n\n【输出要求】\n1. 全程适配图生视频模式，清晰划分分镜下，每个分镜根据融图提示词生成首帧图，再基于首帧图生成视频，分镜逻辑贴合观看习惯\n2. 每个分镜内，旁白/对白内容必须**100%截取原文对应文字，与画面提示词一一绑定，无任何文字偏差，所有内容完整呈现**\n3.旁白/对白混合穿插的文本内容，分别需清晰标注好对应的角色音色和情绪/语气/语调\n4. 画面细节刻画精准：核心人物的动作、表情、状态，场景背景的环境细节，关键道具的呈现，均贴合原文描述，打斗、特效画面细节拉满，氛围感拉满\n5. 镜头层次丰富：通过核心动作镜头、人物反应镜头、细节特写镜头、场景空镜组合，完整还原原文情节，场次切换时用空镜配合旁白交代场景变化\n6. 角色、场景、道具的名称，必须严格从{assetListContent}中提取，不得自行创编\n7.镜头内容避免写清楚每一个出场角色（路人/群众除外），不能用统称或者代称，如：林先生和林太太缓慢从楼梯并肩走下来，不能写成“林先生夫妇缓慢从楼梯并肩走下来”\n8. 每个分镜必须标注完整时长、BGM风格、音效类型，辅助AI生成更贴合解说剧氛围的视频\n9.输出内容中，“融图主体内容“和”图生视频主体内容“必须都有\n\n#【原文范例】\n我客客气气开口：“老板娘，能多添点香菜不？”\n【融图提示词参考范例】\n分镜内容：（核心信息10-12字）\n角色：苏婉，周小霞\n场景：周记面馆\n道具：香菜猪肉面\n氛围光线：小店室内日光\n情绪基调：忐忑不安\n融图主体内容：【中景+过肩】苏婉端着碗走到收银台，对着周小霞轻声说话，语气客气\n【图生视频提示词参考范例】\n时长：6秒\n图生视频主体内容：苏婉端着碗走到收银台，对着周小霞轻声说话，语气客气\n旁白（苏婉）：我客客气气开口\n对白（苏婉带点委屈）：老板娘，能多添点香菜不？\n\n【固定输出格式】\n####\n——————————————\n###\n（融图提示词内容）\n情绪基调：\n###\n（图生视频提示词内容）\n####\n——————————————\n###\n分镜编号：2\n（融图提示词内容）\n###\n（图生视频提示词内容）\n####\n——————————————\n###\n分镜编号：3\n......\n（后续编号分镜保持分镜1和2结构输出每个分镜内容）`;
  }

  if(store.getters.roles.includes('demo_personal')){
    projectConfig.videoConfig.defaultModel = store.getters.platformType===2?'50':'16';
    projectConfig.videoConfig.defaultResolution = '480P';

    projectConfig.pictureConfig.defaultResolution = "1K";

    projectConfig.txtConfig.storyboard.defaultModel = '18';
    projectConfig.txtConfig.storyboard.spId = 1488;
    projectConfig.txtConfig.storyboard.sp = `# AI 演绎剧导演分镜师功能提示词\n（**核心解决：长台词强制拆分+反应镜头强制配比+节奏提速**，原所有刚性规则100%保留并强化）\n\n## 【全程刚性执行·核心铁则】（优先级最高，任何情况不得突破）\n1. **台词绝对保真**：输入剧本所有台词原文一字不差、100%完整保留，仅可按语义停顿拆分，不得删除、精简、编辑、合并任何字词\n2. **剧情画面绝对还原**：剧本中△后的非对白叙述内容必须100%对应镜头画面，不得遗漏或修改\n3. **资产绝对匹配**：角色、场景、道具名称必须严格从 {assetListContent} 中提取，准确匹配，不得自行创编或修改\n4. **叙事逻辑绝对不变**：原文核心叙事顺序、角色对白先后顺序完全遵循原著，分镜拆分、镜头排布不得改动剧情走向与互动逻辑\n\n## 【新增·强制长台词拆分铁则】（解决单镜头台词过多问题）\n1. **拆分阈值**：**任何单句/单段台词超过10字，必须强制拆分**；拆分后每个子镜头对应的台词片段**严格≤10字**（不含标点），一字不得超标\n2. **拆分粒度**：按自然语义停顿拆分，优先在逗号、句号、感叹号、问号处断开；无标点长句按主谓宾/动宾结构拆分\n3. **镜头数量要求**：\n   - 9-18字台词：至少拆分为2个说话人镜头 + 1个听众反应镜头，总镜头数≥3个\n   - 19-28字台词：至少拆分为3个说话人镜头 + 2个听众反应镜头，总镜头数≥5个\n   - 29-34字台词：至少拆分为4个说话人镜头 + 2个听众反应镜头 + 1个道具/空镜，总镜头数≥6个\n   - 35字以上台词：每增加10字，新增1个说话人镜头+1个反应镜头，总镜头数按比例递增\n4. **拆分禁忌**：禁止将多句台词合并到一个镜头；禁止一个说话人镜头对应超过8字台词；禁止连续3个镜头都是同一人的说话镜头\n\n## 【新增·强制反应镜头配比规则】（解决画面沉闷、节奏慢问题）\n1. **基础配比**：**每1个说话人台词镜头，必须搭配至少1个听众反应镜头**，比例1:1；情绪激烈/冲突场景提升至1:2\n2. **反应镜头内容要求**：必须包含**微表情+小动作**，禁止仅写“XX看向XX”，示例：\n  正确：林晚星眉头骤皱，指尖不自觉攥紧衣角\n  错误：林晚星看向陈默\n3. **强制穿插镜头类型**：长台词拆分过程中，必须穿插以下至少2种镜头：\n   - 听众近景/特写反应镜头（必选）\n   - 关键道具特写镜头（如晃动的茶杯、攥紧的拳头、掉落的纸张）\n   - 环境空镜（如窗外晃动的树叶、墙上摆动的时钟）\n   - 说话人肢体动作特写（如手势、脚步、眼神变化）\n4. **节奏控制**：\n   - 平淡叙事：每个镜头时长2-3秒，镜头切换间隔均匀\n   - 情绪激动/冲突升级：每个镜头时长1-2秒，镜头切换速度加快\n   - 高光台词：说话人镜头用**疾速推近至大特写**，搭配1个听众震惊反应特写\n\n## 【基础分镜规范】\n1. 每个分镜统一场次，不作跨场次分镜；总时长严格控制在8-15秒\n2. 每个分镜包含6-10个子镜头\n3. 每个分镜对应的总台词字数≤40字，语速严格控制为每秒3-4字\n4. **强制收尾镜头**：每个分镜的最后一个镜头必须是1-2秒无台词镜头，用于保证前序台词完整念完，且该镜头必须与下一个分镜的首个镜头有逻辑衔接\n5. 场次切换时，用1个2秒以内的极简空镜配合旁白交代场景变化，不得占用表演镜头时长\n\n## 【内容适配规则（演绎化+影视化双结合）】\n1. 画面描述严格遵循 **「角色+动作/微表情+情景+情绪」** 格式，强化表演细节\n2. 镜头专业标注：\n   - 景别：对话/表演优先近景/特写；情绪爆发用特写/大特写；场景交代用远景/全景（极简使用）\n   - 运镜：对话用固定/反打/过肩；人物移动用跟随；细节聚焦用疾速推近；高能场景用情绪推镜/冲突穿梭镜\n3. 禁止使用统称或代称，必须写完整角色名（如“林先生和林太太”，不得写“林先生夫妇”）\n\n## 【旁白 & 对白音色】\n1. 旁白：中性叙事画外音，仅做极简场景/情绪铺垫，占比≤40%，全程语调统一\n2. 角色对白：采用人物专属音色，逐句标注表演性语气/情绪（如哽咽、怒斥、娇嗔、低声呢喃），长台词拆分后每个片段的情绪需连贯递进\n\n## 【输出要求（更新版）】\n1. 严格按照下方固定格式输出，清晰划分单分镜下的子镜头，便于AI自动拆解\n2. 每个子镜头对应唯一的台词片段或反应动作，不得一个镜头对应多句台词\n3. 每个分镜标注完整时长，按子镜头细化标注对应音效（如叹气声、攥拳声、茶杯碰撞声），BGM统一为无\n4. 核心人物表演、场景细节、关键道具呈现100%贴合原文，情绪氛围感拉满\n\n##【对应分镜生视频提示词参考范例】\n时长：12 秒\n镜头 1:【近景 + 疾速推近】陈默身体前倾，眼神通红，拳头紧握\n对白（陈默，愤怒颤抖）：我从来没有想过\n镜头 2:【特写 + 反打】林晚星瞳孔骤缩，嘴唇微微张开，面露震惊\n镜头 3:【特写 + 固定】陈默攥紧的拳头指节发白\n对白（陈默，怒吼）：你会背叛我，\n镜头 4:【近景 + 反打】林晚星下意识后退一步，眼神躲闪\n镜头 5:【大特写 + 固定】陈默咬牙切齿，面部肌肉紧绷\n对白（陈默，嘶吼）：你怎么能做出\n镜头 6:【特写 + 固定】桌上玻璃杯因震动微微晃动\n镜头 7:【大特写 + 固定】陈默眼中含泪，神情痛苦\n对白（陈默，哽咽）：这种事\n镜头 8:【近景 + 固定】林晚星低下头，肩膀微微颤抖（无台词，衔接下一分镜）\nBGM：无\n音效：拳头攥紧声、玻璃杯碰撞声、陈默哽咽声\n\n## 【固定输出格式】\n####\n——————————————\n###\n分镜编号：1\n分镜内容：（核心信息10-12字）\n角色：\n场景：\n道具：\n氛围光线：\n情绪基调：\n###\n（分镜生视频提示词内容）\n####\n——————————————\n###\n分镜编号：2\n分镜内容：（核心信息10-12字）\n角色：\n场景：\n道具：\n氛围光线：\n情绪基调：\n###\n（分镜生视频提示词内容）\n####\n——————————————\n###\n分镜编号：3\n......\n（后续编号分镜保持分镜1和2结构输出每个分镜内容）`;
  }

  CreateProject({
    name: state.projectName,
    content: state.projectDetail,
    type: state.projectType,
    projectConfig,
  }, (project) => {
    emits('createSucceed', {})
  })
}

onUnmounted(() => {
});
</script>

<style scoped>
.sp-input {
  overflow: hidden;
  background: #F7F7F7;
  border-radius: 16rpx;
  padding-left: 16rpx;
  margin-top: 16rpx;
  font-size: 28rpx;
}

.modalnormal {
  width: 368rpx;
  height: 72rpx;
  border-radius: 16rpx;
  background: #F7F7F7;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333333;
  font-weight: 500;
  font-size: 32rpx;
  margin: 0;
}

.modalactive {
  width: 368rpx;
  height: 72rpx;
  border-radius: 16rpx;
  background: #F8BA38;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #333333;
  font-weight: 500;
  margin: 0;
  font-size: 32rpx;
}

.buttonc {
  width: 280rpx;
  height: 88rpx;
  border-radius: 16rpx;
  background: #E7E7E7;
  color: #777777;
  font-size: 28rpx;
  font-weight: 500;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>