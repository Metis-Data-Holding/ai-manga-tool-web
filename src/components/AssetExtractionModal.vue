<template>
  <view class="asset-extraction-mask">
    <view class="asset-extraction-modal">
      <view class="modal-header">
        <view class="modal-heading">
          <text class="modal-title">剧本资产提炼</text>
          <text v-if="currentStepLabel" class="workflow-step">当前步骤：{{ currentStepLabel }}</text>
        </view>
        <view class="close-button" @click="close">×</view>
      </view>

      <view class="modal-body">
        <view class="chat-panel">
          <scroll-view class="message-list" scroll-y :show-scroll-bar="true">
            <view v-if="state.loadingSession" class="empty-tip">会话加载中...</view>
            <view
              v-for="message in state.messages"
              :key="message.id || message.localId"
              :class="['message-item', message.role, { active: state.activeAssistantId === messageKey(message), loading: message.loading }]"
              @click="selectMessage(message)"
            >
              <text class="message-role">{{ message.role === "assistant" ? "AI" : "我" }}</text>
              <view v-if="message.loading" class="typing-dots" title="AI 正在处理">
                <text></text>
                <text></text>
                <text></text>
              </view>
              <text v-else class="message-content">{{ message.content }}</text>
            </view>
          </scroll-view>

          <view class="input-panel">
            <view v-if="state.scriptFileName" class="attachment-card">
              <view class="attachment-icon">
                <uni-icons type="paperclip" color="#1d9bf0" size="22"></uni-icons>
              </view>
              <view class="attachment-copy">
                <text class="attachment-title">{{ state.scriptFileName }}</text>
                <text class="attachment-sub">文档</text>
              </view>
              <button class="attachment-remove" title="移除剧本文档" :disabled="state.clearingScript" @click="clearScriptFile">
                <uni-icons type="close" color="#fff" size="18"></uni-icons>
              </button>
            </view>
            <view v-if="selectedSkill" class="selected-skill-chip">
              <text class="selected-skill-name">@{{ selectedSkill.name || "-" }}</text>
              <button class="selected-skill-clear" title="取消当前 Skill" @click="clearCurrentSkill">
                <uni-icons type="closeempty" color="#2f6fb9" size="16"></uni-icons>
              </button>
            </view>
            <textarea
              v-model="state.inputText"
              class="chat-input"
              :maxlength="-1"
              placeholder="输入@选择SKILL进行资产提炼，或让 AI 根据剧本生成资产草稿"
              @input="handleInputChange"
              @keydown="handleInputKeydown"
            ></textarea>
            <view class="input-actions">
              <view class="input-actions-left">
                <button class="icon-button" title="上传剧本文档" :disabled="state.uploading" @click="pickScriptFile">
                  <uni-icons type="paperclip" color="#202939" size="22"></uni-icons>
                </button>
                <button
                  :class="['icon-button', { active: state.selectedSkillId !== null || state.showSkillMenu }]"
                  :title="selectedSkillTitle"
                  @click="toggleSkillMenu"
                >
                  <text class="at-icon">@</text>
                </button>
              </view>
              <button class="send-icon-button" title="发送消息" :disabled="state.sending" @click="sendMessage">
                <uni-icons type="arrow-up" color="#111827" size="22"></uni-icons>
              </button>
              <view v-if="state.showSkillMenu" class="skill-popover">
                <scroll-view class="skill-popover-list" scroll-y :show-scroll-bar="true">
                  <view :class="['skill-menu-item', { highlighted: state.highlightedSkillIndex === 0 }]" @mouseenter="state.highlightedSkillIndex = 0" @click="selectSkill(null)">
                    <text class="skill-name">不使用 Skill</text>
                  </view>
                  <view
                    v-for="(skill, index) in state.skills"
                    :key="skill.id"
                    :class="['skill-menu-item', { highlighted: state.highlightedSkillIndex === index + 1 }]"
                    @mouseenter="state.highlightedSkillIndex = index + 1"
                    @click="selectSkill(skill.id)"
                  >
                    <text class="skill-name">{{ skill.name || "-" }}</text>
                    <text class="skill-desc">{{ skill.description || "无描述" }}</text>
                  </view>
                  <view v-if="!state.loadingSkills && state.skills.length === 0" class="empty-tip compact">暂无可用 Skill</view>
                </scroll-view>
              </view>
            </view>
          </view>
        </view>

        <view class="draft-panel">
          <view class="draft-tabs">
            <view
              v-for="tab in typeTabs"
              :key="tab.typeId"
              :class="['draft-tab', { active: state.activeTypeId === tab.typeId }]"
              @click="state.activeTypeId = tab.typeId"
            >
              <uni-icons :type="tab.icon" color="#202939" size="20"></uni-icons>
              <text>{{ tab.name }}</text>
              <text class="tab-count">{{ countByType(tab.typeId) }}</text>
            </view>
          </view>

          <scroll-view class="draft-list" scroll-y :show-scroll-bar="true">
            <template v-if="state.activeTypeId === ASSET_LIST_TAB_ID">
              <view v-if="!state.assetListContent.trim()" class="empty-draft">暂无资产总清单</view>
              <view v-else class="draft-card asset-list-card">
                <view class="draft-head">
                  <text class="draft-name">资产总清单</text>
                </view>
                <text class="draft-content-preview">{{ state.assetListContent }}</text>
              </view>
            </template>
            <template v-else>
              <view v-if="filteredDrafts.length === 0" class="empty-draft">暂无资产草稿</view>
              <view v-for="asset in filteredDrafts" :key="asset.localId" class="draft-card">
                <view class="draft-head">
                  <text class="draft-name">{{ asset.name || "未命名资产" }}</text>
                  <view class="draft-actions">
                    <button class="draft-icon-button" title="编辑资产" @click="openDraftEditor(asset)">
                      <uni-icons type="compose" color="#202939" size="18"></uni-icons>
                    </button>
                    <button class="draft-icon-button danger" title="删除资产" @click="deleteDraft(asset.localId)">
                      <uni-icons type="trash" color="#d92d20" size="18"></uni-icons>
                    </button>
                  </view>
                </view>
                <text class="draft-content-preview">{{ asset.content || "暂无资产内容" }}</text>
                <view v-if="Number(asset.typeId) === 2" class="role-fields">
                  <text v-if="asset.coreFeature" class="draft-meta">核心特征：{{ asset.coreFeature }}</text>
                  <text v-if="asset.voiceName" class="draft-meta">音色名称：{{ asset.voiceName }}</text>
                  <text v-if="asset.voiceDetail" class="draft-meta">音色详情：{{ asset.voiceDetail }}</text>
                </view>
              </view>
            </template>
          </scroll-view>
        </view>
      </view>

      <view class="modal-footer">
        <button class="footer-button cancel" @click="close">取消</button>
        <button class="footer-button clear" :disabled="state.clearingSession" @click="openClearSessionConfirm">
          {{ state.clearingSession ? "清空中" : "清空会话" }}
        </button>
        <button
          v-if="showStepConfirmButton"
          class="footer-button confirm"
          :disabled="state.sending || state.savingAssetList"
          @click="confirmCurrentWorkflowStep"
        >
          {{ stepConfirmLabel }}
        </button>
        <button class="footer-button confirm" :disabled="state.confirming" @click="confirmImport">
          {{ state.confirming ? "导入中" : "确认导入" }}
        </button>
      </view>

      <view v-if="state.showClearConfirm" class="clear-confirm-mask">
        <view class="clear-confirm-dialog">
          <text class="clear-confirm-title">清空会话</text>
          <text class="clear-confirm-content">确认清空当前对话、剧本文档、已选 Skill 和资产草稿吗？</text>
          <view class="clear-confirm-actions">
            <button class="footer-button cancel" @click="state.showClearConfirm = false">取消</button>
            <button class="footer-button clear" :disabled="state.clearingSession" @click="confirmClearSession">
              {{ state.clearingSession ? "清空中" : "确认清空" }}
            </button>
          </view>
        </view>
      </view>

      <view v-if="state.showConflict" class="conflict-mask">
        <view class="conflict-dialog">
          <view class="conflict-header">
            <text class="conflict-title">资产冲突处理</text>
            <view class="close-button small" @click="state.showConflict = false">×</view>
          </view>
          <view class="conflict-helper">为每条冲突资产选择处理方式后，再点击确认。</view>
          <scroll-view
            class="conflict-list"
            scroll-y
            :show-scroll-bar="true"
            :scroll-into-view="state.conflictScrollIntoView"
            scroll-with-animation
          >
            <view
              v-for="item in state.conflictItems"
              :id="item.domId"
              :key="item.key"
              :class="['conflict-row', { focused: state.conflictFocusKey === item.key }]"
            >
              <view class="conflict-info">
                <text class="conflict-name">{{ item.typeName || typeNameById(item.typeId) }} / {{ item.name }}</text>
                <text class="conflict-sub">已存在 {{ item.targets.length }} 个同名资产</text>
                <text v-if="!item.strategyValue" class="conflict-pending">待处理：请选择处理方式</text>
              </view>
              <view class="conflict-strategy-tabs">
                <button
                  v-for="strategy in conflictStrategies"
                  :key="strategy.value"
                  :class="['conflict-strategy-tab', { active: item.strategyValue === strategy.value }]"
                  @click="selectConflictStrategy(item, strategy.value)"
                >
                  {{ strategy.label }}
                </button>
              </view>
              <picker
                v-if="item.strategyValue === 'overwrite'"
                :range="item.targets"
                range-key="label"
                :value="item.targetIndex"
                @change="onConflictTargetChange(item, $event)"
              >
                <view class="conflict-select target">{{ item.targets[item.targetIndex]?.label || "选择替换目标" }} ▾</view>
              </picker>
            </view>
          </scroll-view>
          <view class="conflict-actions">
            <view class="conflict-action-group">
              <button class="footer-button confirm compact" @click="applyBulkConflictStrategy('overwrite')">全部替换</button>
              <button class="footer-button confirm compact" @click="applyBulkConflictStrategy('skip')">全部忽略</button>
              <button class="footer-button confirm compact" @click="applyBulkConflictStrategy('create')">全部新增</button>
            </view>
            <view class="conflict-action-group">
              <button class="footer-button cancel compact" @click="state.showConflict = false">取消</button>
              <button class="footer-button confirm compact" :disabled="state.confirming" @click="submitConflictImport">确认</button>
            </view>
          </view>
        </view>
      </view>

      <view v-if="state.showDraftEditor" class="editor-mask">
        <view class="editor-dialog">
          <view class="editor-header">
            <text class="editor-title">编辑资产草稿</text>
            <view class="close-button small" @click="closeDraftEditor">×</view>
          </view>
          <view class="editor-body">
            <view class="editor-field">
              <text class="editor-label">资产类型</text>
              <text class="editor-readonly">{{ typeNameById(state.editingDraft.typeId) }}</text>
            </view>
            <view class="editor-field">
              <text class="editor-label">资产名称</text>
              <input v-model.trim="state.editingDraft.name" class="editor-input" placeholder="资产名称" />
            </view>
            <view class="editor-field">
              <text class="editor-label">生图 SP 内容</text>
              <textarea v-model.trim="state.editingDraft.content" class="editor-textarea" :maxlength="-1" placeholder="资产内容"></textarea>
            </view>
            <view v-if="Number(state.editingDraft.typeId) === 2" class="editor-role-fields">
              <view class="editor-field">
                <text class="editor-label">核心特征</text>
                <input v-model.trim="state.editingDraft.coreFeature" class="editor-input" placeholder="核心特征" />
              </view>
              <view class="editor-field">
                <text class="editor-label">音色名称</text>
                <input v-model.trim="state.editingDraft.voiceName" class="editor-input" placeholder="音色名称" />
              </view>
              <view class="editor-field">
                <text class="editor-label">音色详情</text>
                <textarea v-model.trim="state.editingDraft.voiceDetail" class="editor-textarea small" :maxlength="-1" placeholder="音色详情"></textarea>
              </view>
            </view>
          </view>
          <view class="editor-actions">
            <button class="footer-button cancel" @click="closeDraftEditor">取消</button>
            <button class="footer-button confirm" @click="saveDraftEditor">保存</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, reactive } from "vue";
import {
  ClearAssetExtractionDrafts,
  ClearAssetExtractionSession,
  ClearAssetExtractionScript,
  ConfirmAssetExtraction,
  CreateAssetExtractionSession,
  GetAssetExtractionSession,
  SendAssetExtractionMessage,
  UploadAssetExtractionScript,
} from "@/common/AssetExtractionMgr";
import { UpdateProjectSetting } from "@/common/ProjectMgr";
import { GetSkillList } from "@/common/SkillMgr";

const props = defineProps({
  projectConfig: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(["close", "imported"]);

const ASSET_LIST_TAB_ID = "assetList";

const typeTabs = [
  { name: "总清单", typeId: ASSET_LIST_TAB_ID, icon: "list" },
  { name: "角色", typeId: 2, icon: "person-filled" },
  { name: "场景", typeId: 3, icon: "image" },
  { name: "道具", typeId: 4, icon: "gift-filled" },
];

const conflictStrategies = [
  { label: "新增", value: "create" },
  { label: "替换", value: "overwrite" },
  { label: "忽略", value: "skip" },
];

const emptyEditingDraft = {
  localId: "",
  index: null,
  typeId: null,
  typeName: "",
  name: "",
  content: "",
  coreFeature: "",
  voiceName: "",
  voiceDetail: "",
};

const state = reactive({
  session: null,
  messages: [],
  skills: [],
  drafts: [],
  workflowState: null,
  selectedSkillId: null,
  highlightedSkillIndex: 1,
  activeAssistantId: null,
  activeTypeId: ASSET_LIST_TAB_ID,
  inputText: "",
  assetListContent: "",
  scriptFileName: "",
  loadingSession: false,
  loadingSkills: false,
  uploading: false,
  sending: false,
  clearingScript: false,
  clearingSession: false,
  savingAssetList: false,
  confirming: false,
  showSkillMenu: false,
  showClearConfirm: false,
  showConflict: false,
  showDraftEditor: false,
  editingDraft: { ...emptyEditingDraft },
  conflictItems: [],
  conflictFocusKey: "",
  conflictScrollIntoView: "",
});

const projectId = computed(() => props.projectConfig?.id);
const filteredDrafts = computed(() => state.drafts.filter((asset) => Number(asset.typeId) === Number(state.activeTypeId)));
const skillMenuOptions = computed(() => [{ id: null }, ...state.skills]);
const selectedSkill = computed(() => state.skills.find((item) => item.id === state.selectedSkillId) || null);
const selectedSkillTitle = computed(() => {
  return selectedSkill.value ? `当前 Skill：${selectedSkill.value.name || "-"}` : "选择 Skill";
});
const currentStepCode = computed(() => state.workflowState?.currentStep || "");
const currentStepLabel = computed(() => state.workflowState?.currentStepLabel || "");
const showStepConfirmButton = computed(() => {
  return Boolean(
    selectedSkill.value
    && currentStepCode.value
    && currentStepCode.value !== "FINAL_CONFIG"
  );
});
const stepConfirmLabel = computed(() => {
  if (currentStepCode.value === "ASSET_LIST") {
    return state.savingAssetList ? "同步中" : "确认清单并进入下一步";
  }
  return currentStepCode.value === "STYLE_CONFIRM" ? "使用默认风格继续" : "确认进入下一步";
});

onMounted(() => {
  loadSession();
  loadSkills();
  if (typeof window !== "undefined") {
    window.addEventListener("keydown", handleGlobalKeydown, true);
  }
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener("keydown", handleGlobalKeydown, true);
  }
});

function loadSession() {
  if (!projectId.value) {
    showToast("项目id不能为空");
    return;
  }
  state.loadingSession = true;
  GetAssetExtractionSession(projectId.value, (detail) => {
    state.loadingSession = false;
    if (detail) {
      applySessionDetail(detail);
      return;
    }
    CreateAssetExtractionSession({ projectId: projectId.value }, (created) => {
      state.loadingSession = false;
      applySessionDetail(created);
    }, (error) => {
      state.loadingSession = false;
      showToast(error || "创建资产提炼会话失败");
    });
  }, (error) => {
    state.loadingSession = false;
    showToast(error || "获取资产提炼会话失败");
  });
}

function loadSkills() {
  state.loadingSkills = true;
  GetSkillList({ pageNum: 1, pageSize: 1000, status: 1 }, (result) => {
    state.loadingSkills = false;
    state.skills = result.rows || [];
  }, (error) => {
    state.loadingSkills = false;
    showToast(error || "获取 Skill 列表失败");
  });
}

function applySessionDetail(detail, options = {}) {
  const localSkillId = state.selectedSkillId;
  state.session = detail?.session || null;
  state.messages = detail?.messages || [];
  state.scriptFileName = state.session?.scriptFileName || "";
  state.selectedSkillId = options.preserveLocalSkill && localSkillId !== null
    ? localSkillId
    : state.session?.skillId || null;
  state.workflowState = parseWorkflowState(state.session?.skillSnapshot);
  const lastAssistant = [...state.messages].reverse().find((item) => item.role === "assistant");
  state.activeAssistantId = lastAssistant?.id || null;
  hydrateAssetListFromMessages();
  hydrateDraftsFromSession();
}

function hydrateAssetListFromMessages() {
  const assetListMessage = [...state.messages].reverse().find((message) => {
    return message.role === "assistant" && extractAssetListContent(message.content);
  });
  const parsedAssetList = extractAssetListContent(assetListMessage?.content);
  state.assetListContent = parsedAssetList || "";
}

function hydrateDraftsFromSession() {
  const parsed = parseAssetsJson(state.session?.draftAssets);
  if (parsed?.assets?.length) {
    state.drafts = normalizeDrafts(parsed.assets);
    return;
  }
  state.drafts = [];
}

function selectSkill(skillId) {
  state.selectedSkillId = skillId;
  state.workflowState = null;
  state.showSkillMenu = false;
  state.highlightedSkillIndex = initialSkillHighlightIndex();
  if (state.inputText.endsWith("@")) {
    state.inputText = state.inputText.slice(0, -1);
  }
}

function clearCurrentSkill() {
  state.selectedSkillId = null;
  state.workflowState = null;
  state.showSkillMenu = false;
  state.highlightedSkillIndex = initialSkillHighlightIndex();
}

function selectMessage(message) {
  if (message.role === "assistant") {
    state.activeAssistantId = messageKey(message);
  }
}

function pickScriptFile() {
  if (state.uploading) {
    return;
  }
  if (typeof uni.chooseFile !== "function") {
    showToast("当前环境不支持选择文件");
    return;
  }
  uni.chooseFile({
    count: 1,
    type: "all",
    extension: ["txt", "docx", "pdf"],
    success: (res) => {
      const file = (res.tempFiles && res.tempFiles[0]) || {};
      const filePath = file.path || file.tempFilePath || (res.tempFilePaths && res.tempFilePaths[0]);
      const fileName = file.name || (filePath ? filePath.split("/").pop() : "");
      uploadScript(filePath, fileName);
    },
  });
}

function uploadScript(filePath, fileName) {
  if (!filePath) {
    showToast("未读取到待上传文件");
    return;
  }
  if (!isSupportedScript(fileName || filePath)) {
    showToast("仅支持 .txt、.docx、.pdf 格式");
    return;
  }
  state.uploading = true;
  uni.showLoading({ title: "上传中", mask: true });
  UploadAssetExtractionScript(projectId.value, state.session?.id, filePath, fileName, (detail) => {
    uni.hideLoading();
    state.uploading = false;
    applySessionDetail(detail, { preserveLocalSkill: true });
    showToast("剧本文档已上传", "success");
  }, (error) => {
    uni.hideLoading();
    state.uploading = false;
    showToast(error || "剧本文档上传失败");
  });
}

function clearScriptFile() {
  if (!state.scriptFileName) {
    return;
  }
  if (!state.session?.id) {
    state.scriptFileName = "";
    return;
  }
  state.clearingScript = true;
  ClearAssetExtractionScript(projectId.value, state.session.id, (detail) => {
    state.clearingScript = false;
    applySessionDetail(detail);
    showToast("剧本文档已移除", "success");
  }, (error) => {
    state.clearingScript = false;
    showToast(error || "移除剧本文档失败");
  });
}

function openClearSessionConfirm() {
  state.showClearConfirm = true;
}

function confirmClearSession() {
  if (!state.session?.id) {
    resetSessionContent();
    state.showClearConfirm = false;
    return;
  }
  state.clearingSession = true;
  ClearAssetExtractionSession(projectId.value, state.session.id, (detail) => {
    state.clearingSession = false;
    state.showClearConfirm = false;
    applySessionDetail(detail);
    state.assetListContent = "";
    state.showConflict = false;
    state.showDraftEditor = false;
    showToast("会话已清空", "success");
  }, (error) => {
    state.clearingSession = false;
    showToast(error || "清空会话失败");
  });
}

function resetSessionContent() {
  state.messages = [];
  state.drafts = [];
  state.assetListContent = "";
  state.workflowState = null;
  state.selectedSkillId = null;
  state.scriptFileName = "";
  state.activeAssistantId = null;
  state.showSkillMenu = false;
  state.showClearConfirm = false;
  state.showConflict = false;
  state.showDraftEditor = false;
}

function handleInputChange(event) {
  const value = event?.detail?.value ?? state.inputText;
  if (value.endsWith("@")) {
    state.showSkillMenu = true;
    state.highlightedSkillIndex = initialSkillHighlightIndex();
  }
}

function handleInputKeydown(event) {
  if (event.isComposing || handleSkillMenuKeyboardEvent(event)) {
    return;
  }
  if (event.key !== "Enter" || event.shiftKey || event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }
  event.preventDefault();
  sendMessage();
}

function handleGlobalKeydown(event) {
  handleSkillMenuKeyboardEvent(event);
}

function handleSkillMenuKeyboardEvent(event) {
  if (!state.showSkillMenu || !["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) {
    return false;
  }
  event.preventDefault();
  event.stopPropagation();
  handleSkillMenuKeydown(event.key);
  return true;
}

function handleSkillMenuKeydown(key) {
  const optionCount = skillMenuOptions.value.length;
  if (optionCount === 0) {
    return;
  }
  if (key === "ArrowDown") {
    state.highlightedSkillIndex = (state.highlightedSkillIndex + 1) % optionCount;
    return;
  }
  if (key === "ArrowUp") {
    state.highlightedSkillIndex = (state.highlightedSkillIndex - 1 + optionCount) % optionCount;
    return;
  }
  const option = skillMenuOptions.value[state.highlightedSkillIndex] || skillMenuOptions.value[0];
  selectSkill(option.id);
}

function sendMessage() {
  if (state.sending) {
    return;
  }
  const content = state.inputText.trim();
  if (!content) {
    showToast("请输入提炼要求");
    return;
  }
  state.showSkillMenu = false;
  state.inputText = "";
  if (currentStepCode.value === "ASSET_LIST" && isConfirmText(content)) {
    confirmAssetListAndContinue();
    return;
  }
  submitChatMessage(content);
}

function submitChatMessage(content) {
  state.sending = true;
  const localUser = {
    localId: buildLocalId("user"),
    role: "user",
    content,
  };
  const loadingAssistant = {
    localId: buildLocalId("assistant"),
    role: "assistant",
    content: "",
    loading: true,
  };
  state.messages.push(localUser, loadingAssistant);
  state.activeAssistantId = loadingAssistant.localId;
  SendAssetExtractionMessage({
    projectId: projectId.value,
    sessionId: state.session?.id,
    skillId: state.selectedSkillId,
    content,
  }, (result) => {
    state.sending = false;
    applySessionDetail(result?.session);
    const assetListContent = extractAssetListContent(result?.assistantMessage?.content);
    if (assetListContent) {
      state.assetListContent = assetListContent;
      state.activeTypeId = ASSET_LIST_TAB_ID;
      showToast("资产总清单已生成，请确认", "success");
      return;
    }
    if (result?.parsedAssets?.assets?.length) {
      state.drafts = normalizeDrafts(result.parsedAssets.assets);
      showToast("资产草稿已生成", "success");
    } else if (!state.selectedSkillId) {
      showToast("AI 回复未解析到资产草稿");
    }
  }, (error) => {
    state.sending = false;
    removeLocalMessages([localUser.localId, loadingAssistant.localId]);
    showToast(error || "资产提炼失败");
  });
}

function confirmAssetListAndContinue() {
  const assetListContent = getCurrentAssetListContent();
  if (!assetListContent) {
    showToast("未找到可同步的资产总清单");
    return;
  }
  if (!state.selectedSkillId) {
    showToast("请选择 Skill 后继续");
    return;
  }
  if (state.savingAssetList || state.sending) {
    return;
  }
  const projectPayload = clonePlain(props.projectConfig);
  projectPayload.assetListContent = assetListContent;
  state.savingAssetList = true;
  UpdateProjectSetting(projectPayload, () => {
    state.savingAssetList = false;
    props.projectConfig.assetListContent = assetListContent;
    showToast("资产总清单已写入项目设置", "success");
    submitChatMessage("确认，进入步骤三：人物小传和性格特征");
  }, (error) => {
    state.savingAssetList = false;
    showToast(error || "保存资产总清单失败");
  });
}

function confirmCurrentWorkflowStep() {
  if (!showStepConfirmButton.value || state.sending) {
    return;
  }
  if (currentStepCode.value === "ASSET_LIST") {
    confirmAssetListAndContinue();
    return;
  }
  const content = currentStepCode.value === "STYLE_CONFIRM"
    ? "确认，使用默认写实风格，进入下一步"
    : "确认，进入下一步";
  submitChatMessage(content);
}

function getCurrentAssetListContent() {
  const message = [...state.messages].reverse().find((item) => item.role === "assistant" && extractAssetListContent(item.content));
  return (extractAssetListContent(message?.content) || state.assetListContent || "").trim();
}

function deleteDraft(localId) {
  state.drafts = state.drafts.filter((asset) => asset.localId !== localId);
}

function openDraftEditor(asset) {
  state.editingDraft = { ...emptyEditingDraft, ...asset };
  state.showDraftEditor = true;
}

function closeDraftEditor() {
  state.showDraftEditor = false;
  state.editingDraft = { ...emptyEditingDraft };
}

function saveDraftEditor() {
  const name = (state.editingDraft.name || "").trim();
  const content = (state.editingDraft.content || "").trim();
  if (!name || !content) {
    showToast("资产名称和生图 SP 内容不能为空");
    return;
  }
  const index = state.drafts.findIndex((asset) => asset.localId === state.editingDraft.localId);
  if (index < 0) {
    closeDraftEditor();
    return;
  }
  state.drafts[index] = {
    ...state.drafts[index],
    name,
    content,
    coreFeature: (state.editingDraft.coreFeature || "").trim(),
    voiceName: (state.editingDraft.voiceName || "").trim(),
    voiceDetail: (state.editingDraft.voiceDetail || "").trim(),
  };
  closeDraftEditor();
}

function toggleSkillMenu() {
  state.showSkillMenu = !state.showSkillMenu;
  if (state.showSkillMenu) {
    state.highlightedSkillIndex = initialSkillHighlightIndex();
  }
}

function confirmImport() {
  const assets = buildConfirmAssets();
  if (assets.length === 0) {
    showToast("暂无可导入资产");
    return;
  }
  submitConfirm(assets);
}

function submitConflictImport() {
  const unresolved = state.conflictItems.find((conflict) => !conflict.strategyValue);
  if (unresolved) {
    focusConflictItem(unresolved);
    showToast("请先处理高亮的冲突资产");
    return;
  }
  const assets = buildConfirmAssets();
  state.conflictItems.forEach((conflict) => {
    const asset = assets.find((item) => conflict.matchKey === draftMatchKey(item));
    if (!asset) {
      return;
    }
    asset.conflictStrategy = conflict.strategyValue;
    asset.conflictItemId = conflict.strategyValue === "overwrite" ? conflict.targets[conflict.targetIndex]?.id : null;
  });
  state.showConflict = false;
  submitConfirm(assets);
}

function submitConfirm(assets) {
  state.confirming = true;
  uni.showLoading({ title: "导入中", mask: true });
  ConfirmAssetExtraction(projectId.value, assets, (result) => {
    uni.hideLoading();
    state.confirming = false;
    if (result?.hasConflict) {
      state.conflictItems = buildConflictItems(result.conflicts || []);
      state.conflictFocusKey = "";
      state.conflictScrollIntoView = "";
      state.showConflict = true;
      return;
    }
    const message = `导入完成：新增${result?.createdCount || 0}，替换${result?.overwrittenCount || 0}，忽略${result?.skippedCount || 0}`;
    clearDraftsAfterImport(message);
  }, (error) => {
    uni.hideLoading();
    state.confirming = false;
    showToast(error || "确认导入失败");
  });
}

function clearDraftsAfterImport(message) {
  state.drafts = [];
  state.showConflict = false;
  if (!state.session?.id) {
    showToast(message, "success");
    emits("imported");
    return;
  }
  ClearAssetExtractionDrafts(projectId.value, state.session.id, (detail) => {
    applySessionDetail(detail);
    state.drafts = [];
    showToast(message, "success");
    emits("imported");
  }, (error) => {
    showToast(error || "导入成功，但清空资产草稿失败");
    emits("imported");
  });
}

function buildConfirmAssets() {
  return state.drafts
    .map((asset, index) => ({
      index: asset.index || index + 1,
      typeId: Number(asset.typeId),
      typeName: asset.typeName || typeNameById(asset.typeId),
      name: (asset.name || "").trim(),
      content: (asset.content || "").trim(),
      coreFeature: (asset.coreFeature || "").trim(),
      voiceName: (asset.voiceName || "").trim(),
      voiceDetail: (asset.voiceDetail || "").trim(),
      conflictStrategy: asset.conflictStrategy || "",
      conflictItemId: asset.conflictItemId || null,
    }))
    .filter((asset) => asset.name && asset.content);
}

function buildConflictItems(conflicts) {
  const grouped = new Map();
  conflicts.forEach((conflict) => {
    const matchKey = draftMatchKey(conflict);
    if (!grouped.has(matchKey)) {
      const domId = `conflict_item_${grouped.size}`;
      grouped.set(matchKey, {
        ...conflict,
        key: matchKey,
        domId,
        matchKey,
        strategyValue: "",
        targetIndex: 0,
        targets: [],
      });
    }
    grouped.get(matchKey).targets.push({
      id: conflict.conflictItemId,
      label: conflict.conflictItemName || `${conflict.conflictItemId}`,
    });
  });
  return Array.from(grouped.values());
}

function selectConflictStrategy(item, strategyValue) {
  item.strategyValue = strategyValue;
  if (state.conflictFocusKey === item.key) {
    state.conflictFocusKey = "";
  }
}

function onConflictTargetChange(item, event) {
  item.targetIndex = Number(event.detail.value || 0);
}

function applyBulkConflictStrategy(strategyValue) {
  state.conflictItems.forEach((item) => {
    item.strategyValue = strategyValue;
  });
  state.conflictFocusKey = "";
  state.conflictScrollIntoView = "";
}

function focusConflictItem(item) {
  state.conflictFocusKey = item.key;
  state.conflictScrollIntoView = "";
  setTimeout(() => {
    state.conflictScrollIntoView = item.domId;
  }, 0);
}

function normalizeDrafts(assets) {
  return (assets || []).map((asset, index) => ({
    localId: `${Date.now()}_${index}_${Math.random().toString(16).slice(2)}`,
    index: asset.index || index + 1,
    typeId: Number(asset.typeId),
    typeName: asset.typeName || typeNameById(asset.typeId),
    name: asset.name || "",
    content: asset.content || "",
    coreFeature: asset.coreFeature || "",
    voiceName: asset.voiceName || "",
    voiceDetail: asset.voiceDetail || "",
  }));
}

function parseAssetsJson(value) {
  if (!value) {
    return null;
  }
  if (typeof value === "object") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

function parseWorkflowState(skillSnapshot) {
  const snapshot = parseAssetsJson(skillSnapshot);
  return snapshot?.workflowState || null;
}

function extractAssetListContent(content = "") {
  if (!content) {
    return "";
  }
  const lines = content
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const roleLine = lines.find((line) => /^角色[:：]/.test(line));
  const sceneLine = lines.find((line) => /^场景[:：]/.test(line));
  const propLine = lines.find((line) => /^道具[:：]/.test(line));
  if (!roleLine || !sceneLine || !propLine) {
    return "";
  }
  return [roleLine, sceneLine, propLine]
    .map((line) => line.replace(/^([^:：]+)[:：]\s*/, "$1："))
    .join("\n");
}

function clonePlain(value) {
  return JSON.parse(JSON.stringify(value || {}));
}

function draftMatchKey(asset) {
  return `${asset.index || ""}_${Number(asset.typeId) || ""}_${asset.name || ""}`;
}

function typeNameById(typeId) {
  if (typeId === ASSET_LIST_TAB_ID) {
    return "总清单";
  }
  const tab = typeTabs.find((item) => Number(item.typeId) === Number(typeId));
  return tab?.name || "";
}

function countByType(typeId) {
  if (typeId === ASSET_LIST_TAB_ID) {
    return state.assetListContent.trim() ? 1 : 0;
  }
  return state.drafts.filter((asset) => Number(asset.typeId) === Number(typeId)).length;
}

function initialSkillHighlightIndex() {
  if (state.selectedSkillId === null) {
    return 0;
  }
  const skillIndex = state.skills.findIndex((skill) => skill.id === state.selectedSkillId);
  return skillIndex >= 0 ? skillIndex + 1 : (state.skills.length > 0 ? 1 : 0);
}

function isConfirmText(content = "") {
  return /^(确认无误|进入下一步|没有问题|没问题|确认|继续|下一步|可以|好的|通过|ok|好)([\s，。,！!、]|$)/i.test(content.trim());
}

function messageKey(message) {
  return message?.id || message?.localId || "";
}

function buildLocalId(prefix) {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function removeLocalMessages(localIds) {
  const localIdSet = new Set(localIds);
  state.messages = state.messages.filter((message) => !localIdSet.has(message.localId));
}

function isSupportedScript(fileName = "") {
  const lowerName = fileName.toLowerCase();
  return lowerName.endsWith(".txt") || lowerName.endsWith(".docx") || lowerName.endsWith(".pdf");
}

function showToast(title, icon = "none") {
  uni.showToast({ title, icon, duration: 2500 });
}

function close() {
  emits("close");
}
</script>

<style scoped lang="scss">
.asset-extraction-mask {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.38);
  display: flex;
  align-items: center;
  justify-content: center;
}

.asset-extraction-modal {
  position: relative;
  width: 92vw;
  max-width: 1240px;
  height: 86vh;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.24);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  height: 88px;
  padding: 0 32px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
}

.modal-heading {
  display: flex;
  align-items: center;
  gap: 18px;
}

.modal-title {
  font-size: 30px;
  font-weight: bold;
  color: #ffa701;
}

.workflow-step {
  padding: 6px 12px;
  border-radius: 999px;
  background: #fff7e3;
  color: #8a5a00;
  font-size: 14px;
  font-weight: bold;
}

.close-button {
  width: 42px;
  height: 42px;
  border-radius: 50%;
  background: #f04444;
  color: #fff;
  font-size: 30px;
  line-height: 38px;
  text-align: center;
  cursor: pointer;

  &.small {
    width: 32px;
    height: 32px;
    font-size: 24px;
    line-height: 28px;
  }
}

.modal-body {
  flex: 1;
  min-height: 0;
  display: flex;
  background: #f5f6f8;
}

.chat-panel,
.draft-panel {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.chat-panel {
  border-right: 1px solid #e7eaf0;
  padding: 24px 28px;
}

.draft-panel {
  background: #fff;
}

.skill-desc,
.conflict-sub {
  margin-top: 4px;
  font-size: 12px;
  color: #8a94a6;
}

.footer-button {
  margin: 0;
  border-radius: 8px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: normal;

  &::after {
    border: none;
  }
}

.skill-name {
  font-size: 14px;
  font-weight: bold;
  color: #202939;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.message-list {
  flex: 1;
  min-height: 0;
  padding-right: 6px;
}

.message-item {
  width: 76%;
  margin-bottom: 12px;
  padding: 12px 14px;
  border: 1px solid #dde2ea;
  border-radius: 8px;
  background: #fff;
  box-sizing: border-box;

  &.user {
    margin-left: auto;
    background: #fff7e3;
    border-color: #f8dc91;
  }

  &.assistant {
    cursor: pointer;
  }

  &.active {
    border-color: #ffa701;
    box-shadow: 0 0 0 2px rgba(255, 167, 1, 0.14);
  }

  &.loading {
    width: 120px;
  }
}

.message-role {
  display: block;
  margin-bottom: 6px;
  font-size: 12px;
  font-weight: bold;
  color: #8a94a6;
}

.message-content {
  font-size: 14px;
  line-height: 1.6;
  color: #202939;
  white-space: pre-wrap;
  word-break: break-word;
}

.typing-dots {
  height: 22px;
  display: flex;
  align-items: center;
  gap: 5px;

  text {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #8a94a6;
    animation: typing-bounce 1s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.15s;
    }

    &:nth-child(3) {
      animation-delay: 0.3s;
    }
  }
}

@keyframes typing-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.45;
  }

  40% {
    transform: translateY(-4px);
    opacity: 1;
  }
}

.input-panel {
  margin-top: 12px;
  background: #fff;
  border: 1px solid #dde2ea;
  border-radius: 14px;
  position: relative;
  overflow: visible;
}

.attachment-card {
  width: calc(100% - 28px);
  margin: 14px 14px 0;
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  border: 1px solid #dde2ea;
  border-radius: 10px;
  background: #fff;
  box-sizing: border-box;
}

.attachment-icon {
  width: 42px;
  height: 42px;
  border-radius: 8px;
  background: #e9f4ff;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.attachment-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.attachment-title {
  font-size: 14px;
  font-weight: bold;
  color: #202939;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.attachment-sub {
  margin-top: 4px;
  font-size: 12px;
  color: #8a94a6;
}

.attachment-remove {
  width: 30px;
  height: 30px;
  padding: 0;
  margin: 0;
  border-radius: 15px;
  background: #111827;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &::after {
    border: none;
  }
}

.selected-skill-chip {
  width: fit-content;
  max-width: calc(100% - 28px);
  margin: 14px 14px 0;
  padding: 6px 8px 6px 10px;
  display: flex;
  align-items: center;
  gap: 6px;
  border-radius: 8px;
  background: #eaf4ff;
  box-sizing: border-box;
}

.selected-skill-name {
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 15px;
  font-weight: bold;
  color: #2f6fb9;
}

.selected-skill-clear {
  width: 18px;
  height: 18px;
  padding: 0;
  margin: 0;
  border-radius: 9px;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &::after {
    border: none;
  }

  &:hover {
    background: rgba(47, 111, 185, 0.12);
  }
}

.chat-input {
  width: 100%;
  height: 104px;
  padding: 14px 16px 6px;
  box-sizing: border-box;
  font-size: 14px;
  line-height: 1.6;
}

.input-actions {
  height: 52px;
  padding: 6px 12px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  box-sizing: border-box;
}

.input-actions-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-button,
.send-icon-button {
  width: 36px;
  height: 36px;
  padding: 0;
  margin: 0;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &::after {
    border: none;
  }
}

.icon-button {
  background: #fff;

  &:hover,
  &.active {
    background: #fff7e3;
  }
}

.send-icon-button {
  background: #f8ba38;
  color: #111827;

  &:disabled {
    opacity: 0.6;
  }
}

.at-icon {
  font-size: 22px;
  font-weight: bold;
  line-height: 1;
  color: #202939;
}

.skill-popover {
  position: absolute;
  left: 56px;
  bottom: 48px;
  width: 300px;
  max-height: 260px;
  padding: 8px;
  border: 1px solid #dde2ea;
  border-radius: 14px;
  background: #fff;
  box-shadow: 0 16px 42px rgba(17, 24, 39, 0.18);
  z-index: 3;
  box-sizing: border-box;
}

.skill-popover-list {
  max-height: 244px;
}

.skill-menu-item {
  padding: 10px 12px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  &.highlighted {
    background: #fff7e3;
  }
}

.draft-tabs {
  height: 72px;
  padding: 0;
  display: flex;
  align-items: center;
  background: #f0f2f5;
  box-sizing: border-box;
}

.draft-tab {
  flex: 1;
  height: 100%;
  border-radius: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  color: #202939;
  cursor: pointer;
  border-right: 1px solid #dde2ea;

  &:last-child {
    border-right: none;
  }

  &.active {
    background: #f8ba38;
    box-shadow: none;
  }
}

.tab-count {
  min-width: 22px;
  height: 22px;
  padding: 0 6px;
  border-radius: 11px;
  background: rgba(255, 255, 255, 0.65);
  font-size: 12px;
  line-height: 22px;
  text-align: center;
}

.draft-list {
  flex: 1;
  min-height: 0;
  padding: 24px 28px;
  box-sizing: border-box;
}

.draft-card {
  margin-bottom: 16px;
  padding: 16px;
  border: 1px solid #dde2ea;
  border-radius: 8px;
  background: #fff;
}

.draft-head {
  display: flex;
  align-items: center;
  gap: 12px;
}

.draft-name {
  flex: 1;
  font-size: 18px;
  font-weight: bold;
  color: #111827;
  line-height: 1.4;
  word-break: break-word;
}

.draft-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.clear-confirm-mask {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 10;
  background: rgba(17, 24, 39, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
}

.clear-confirm-dialog {
  width: 420px;
  padding: 24px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 18px 50px rgba(17, 24, 39, 0.18);
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
}

.clear-confirm-title {
  font-size: 20px;
  font-weight: bold;
  color: #202939;
}

.clear-confirm-content {
  margin-top: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: #5f6b7a;
}

.clear-confirm-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.draft-icon-button {
  width: 30px;
  height: 30px;
  padding: 0;
  margin: 0;
  border-radius: 15px;
  background: #f7f8fa;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &::after {
    border: none;
  }

  &:hover {
    background: #fff7e3;
  }

  &.danger:hover {
    background: #fff1f0;
  }
}

.draft-content-preview {
  display: block;
  margin-top: 12px;
  padding: 12px;
  border-radius: 8px;
  background: #f7f8fa;
  box-sizing: border-box;
  font-size: 14px;
  color: #202939;
  line-height: 1.5;
  white-space: pre-wrap;
  word-break: break-word;
}

.role-fields {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.draft-meta {
  font-size: 13px;
  line-height: 1.5;
  color: #5f6b7a;
  word-break: break-word;
}

.empty-tip,
.empty-draft {
  padding: 24px;
  text-align: center;
  color: #8a94a6;
  font-size: 14px;

  &.compact {
    padding: 14px;
  }
}

.modal-footer {
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  border-top: 1px solid #f0f0f0;
  background: #fff;
}

.footer-button {
  width: 136px;
  height: 44px;

  &.cancel {
    background: #e9edf3;
    border: 1px solid #d5dbe5;
    color: #202939;
  }

  &.confirm {
    background: #f8ba38;
    color: #111827;
  }

  &.clear {
    background: #f8ba38;
    color: #111827;
  }

  &.wide {
    width: 190px;
  }

  &.compact {
    width: 96px;
  }
}

.conflict-mask {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(17, 24, 39, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
}

.conflict-dialog {
  width: 680px;
  max-height: 70vh;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.conflict-header {
  height: 64px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
}

.conflict-title {
  font-size: 20px;
  font-weight: bold;
  color: #202939;
}

.conflict-helper {
  padding: 12px 20px 0;
  font-size: 13px;
  color: #667085;
}

.conflict-list {
  max-height: 420px;
  padding: 16px 20px;
  box-sizing: border-box;
}

.conflict-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 270px 190px;
  gap: 12px;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  border-radius: 10px;

  &.focused {
    border: 1px solid #f04444;
    background: #fff6f5;
    box-shadow: 0 0 0 2px rgba(240, 68, 68, 0.12);
  }
}

.conflict-info {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.conflict-name {
  font-size: 15px;
  font-weight: bold;
  color: #202939;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conflict-pending {
  width: fit-content;
  margin-top: 8px;
  padding: 3px 8px;
  border-radius: 999px;
  background: #fff1f0;
  color: #b42318;
  font-size: 12px;
  font-weight: bold;
}

.conflict-strategy-tabs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}

.conflict-strategy-tab {
  height: 36px;
  padding: 0 8px;
  margin: 0;
  border: 1px solid #dde2ea;
  border-radius: 8px;
  background: #fff;
  color: #202939;
  font-size: 13px;
  font-weight: bold;
  line-height: normal;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &::after {
    border: none;
  }

  &.active {
    border-color: #e39a00;
    background: #f8ba38;
    color: #111827;
    box-shadow: 0 2px 6px rgba(248, 186, 56, 0.35);
  }
}

.conflict-select {
  height: 36px;
  padding: 0 10px;
  border: 1px solid #dde2ea;
  border-radius: 8px;
  line-height: 36px;
  font-size: 14px;
  color: #202939;
  background: #fff;

  &.target {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.conflict-actions {
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 20px;
  border-top: 1px solid #f0f0f0;
}

.conflict-action-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.editor-mask {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background: rgba(17, 24, 39, 0.48);
  display: flex;
  align-items: center;
  justify-content: center;
}

.editor-dialog {
  width: 560px;
  max-height: 78vh;
  background: #fff;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-header {
  height: 64px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
}

.editor-title {
  font-size: 20px;
  font-weight: bold;
  color: #202939;
}

.editor-body {
  padding: 18px 20px;
  overflow-y: auto;
}

.editor-field {
  margin-bottom: 14px;
}

.editor-label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: bold;
  color: #5f6b7a;
}

.editor-readonly {
  display: block;
  height: 38px;
  padding: 0 12px;
  border-radius: 8px;
  background: #f7f8fa;
  line-height: 38px;
  color: #202939;
}

.editor-input,
.editor-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #dde2ea;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 14px;
  color: #202939;
}

.editor-input {
  height: 40px;
}

.editor-textarea {
  height: 132px;
  line-height: 1.5;

  &.small {
    height: 86px;
  }
}

.editor-actions {
  height: 72px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  border-top: 1px solid #f0f0f0;
}
</style>
