<template>
  <view class="skill-detail-page">
    <view class="detail-header">
      <view class="title-block">
        <text class="breadcrumb">SKILL 管理 / {{ skillName }} / {{ isEdit ? "编辑" : "详情" }}</text>
        <text class="page-title">SKILL {{ isEdit ? "编辑" : "详情" }}</text>
      </view>
      <view class="header-actions">
        <button class="plain-button" @click="$emit('back')">返回列表</button>
        <button v-if="!isEdit" class="plain-button" @click="$emit('edit', state.skill.id)">编辑</button>
        <button v-if="isEdit" class="plain-button" @click="$emit('back')">取消</button>
        <button v-if="isEdit" class="primary-button" @click="publishDraft">发布更新</button>
        <button class="danger-button" @click="confirmDelete">删除</button>
        <view class="switch-row">
          <text>启用</text>
          <switch :checked="Number(state.form.status) === 1" color="#F8BA38" @change="onStatusSwitch" />
        </view>
      </view>
    </view>

    <view v-if="state.loading" class="loading-panel">加载中...</view>
    <view v-else class="detail-content">
      <view class="left-column">
        <view class="panel">
          <view class="panel-title">基础信息</view>
          <view v-if="isEdit" class="form-list">
            <view class="form-row">
              <text class="form-label">SKILL 名称</text>
              <input v-model="state.form.name" class="form-input" placeholder="请输入 Skill 名称" />
            </view>
            <view class="form-row">
              <text class="form-label">描述</text>
              <textarea
                v-model="state.form.description"
                class="form-textarea"
                :maxlength="200"
                placeholder="请输入 Skill 描述"
              />
            </view>
            <button class="save-basic-button" :disabled="state.savingBasic" @click="saveBasic">
              {{ state.savingBasic ? "保存中" : "保存基础信息" }}
            </button>
          </view>
          <view v-else class="info-list">
            <view class="info-row">
              <text class="info-label">SKILL 名称</text>
              <text class="info-value">{{ state.skill.name || "-" }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">版本</text>
              <text class="info-value">v{{ state.skill.version || 1 }}</text>
            </view>
            <view class="info-row">
              <text class="info-label">描述</text>
              <text class="info-value">{{ state.skill.description || "-" }}</text>
            </view>
          </view>
        </view>

        <view class="panel tree-panel">
          <view class="panel-title">文件结构</view>
          <scroll-view class="tree-scroll" :scroll-y="true">
            <view
              v-for="node in treeRows"
              :key="node.path"
              :class="['tree-row', { active: state.activePath === node.path, disabled: node.directory }]"
              :style="{ paddingLeft: `${24 + node.depth * 28}rpx` }"
              @click="selectNode(node)"
            >
              <text class="tree-icon">{{ node.directory ? "D" : node.textFile ? "T" : "B" }}</text>
              <text class="tree-name">{{ node.name }}</text>
              <text v-if="!node.directory" class="tree-size">{{ formatFileSize(node.size) }}</text>
            </view>
            <view v-if="treeRows.length === 0" class="empty-text">暂无文件结构</view>
          </scroll-view>
        </view>

        <view class="panel validate-panel">
          <view class="panel-title">校验结果</view>
          <view class="check-row">
            <text :class="['status-dot', getParseStatusMeta(state.skill.parseStatus).className]"></text>
            <text class="check-name">解析状态</text>
            <text :class="['check-value', getParseStatusMeta(state.skill.parseStatus).className]">
              {{ getParseStatusMeta(state.skill.parseStatus).text }}
            </text>
          </view>
          <view class="check-row">
            <text :class="['status-dot', getValidateStatusMeta(state.skill.validateStatus).className]"></text>
            <text class="check-name">校验状态</text>
            <text :class="['check-value', getValidateStatusMeta(state.skill.validateStatus).className]">
              {{ getValidateStatusMeta(state.skill.validateStatus).text }}
            </text>
          </view>
          <text v-if="state.skill.parseMessage" class="message-text">{{ state.skill.parseMessage }}</text>
          <text v-if="state.skill.validateMessage" class="message-text">{{ state.skill.validateMessage }}</text>
        </view>

        <view class="panel meta-panel">
          <view class="panel-title">元数据</view>
          <view class="meta-grid">
            <view class="meta-item">
              <text class="meta-label">原始文件</text>
              <text class="meta-value">{{ state.skill.originalFileName || "-" }}</text>
            </view>
            <view class="meta-item">
              <text class="meta-label">版本</text>
              <text class="meta-value">v{{ state.skill.version || 1 }}</text>
            </view>
            <view class="meta-item">
              <text class="meta-label">文件数量</text>
              <text class="meta-value">{{ state.skill.fileCount || 0 }}</text>
            </view>
            <view class="meta-item">
              <text class="meta-label">版本大小</text>
              <text class="meta-value">{{ formatFileSize(state.skill.packageSize) }}</text>
            </view>
            <view class="meta-item">
              <text class="meta-label">更新时间</text>
              <text class="meta-value">{{ state.skill.updateTime || "-" }}</text>
            </view>
            <view class="meta-item">
              <text class="meta-label">格式哈希</text>
              <text class="meta-value hash-text">{{ state.skill.packageHash || "-" }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="right-column">
        <view class="editor-toolbar">
          <view class="editor-title">
            <text>{{ isEdit ? "文件编辑器" : "文档预览" }}</text>
            <text class="editor-hint">{{ editorHint }}</text>
          </view>
          <view class="editor-actions">
            <button v-if="isEdit" class="plain-button small" :disabled="!canEditFile" @click="formatCurrentFile">格式化</button>
            <button class="plain-button small" :disabled="!state.selectedFile" @click="openFullscreen">全屏</button>
            <button
              v-if="isEdit"
              class="primary-button small"
              :disabled="!canEditFile || state.savingFile"
              @click="saveCurrentFile"
            >
              {{ state.savingFile ? "保存中" : "保存文件" }}
            </button>
          </view>
        </view>

        <view class="editor-shell">
          <view v-if="!state.selectedFile" class="empty-editor">请选择左侧文件进行预览</view>
          <view v-else-if="!state.selectedFile.textFile" class="empty-editor">
            <text>二进制文件只读展示</text>
            <text class="binary-meta">{{ state.selectedFile.path }} · {{ formatFileSize(state.selectedFile.size) }}</text>
          </view>
          <textarea
            v-else-if="isEdit"
            v-model="state.editorContent"
            class="code-textarea"
            :maxlength="-1"
            placeholder="请输入文件内容"
          />
          <scroll-view v-else class="preview-scroll" :scroll-y="true">
            <view v-for="(line, index) in previewLines" :key="index" class="code-line">
              <text class="line-number">{{ index + 1 }}</text>
              <text class="line-content">{{ line || " " }}</text>
            </view>
          </scroll-view>
        </view>
      </view>
    </view>

    <view v-if="state.fullscreen" class="fullscreen-mask">
      <view class="fullscreen-panel">
        <view class="fullscreen-toolbar">
          <text class="fullscreen-title">{{ state.selectedFile ? state.selectedFile.path : "文件编辑" }}</text>
          <view class="editor-actions">
            <button v-if="isEdit" class="plain-button small" :disabled="!canEditFile" @click="formatCurrentFile">格式化</button>
            <button
              v-if="isEdit"
              class="primary-button small"
              :disabled="!canEditFile || state.savingFile"
              @click="saveCurrentFile"
            >
              {{ state.savingFile ? "保存中" : "保存文件" }}
            </button>
            <button class="plain-button small" @click="state.fullscreen = false">退出全屏</button>
          </view>
        </view>
        <textarea
          v-if="canEditFile"
          v-model="state.editorContent"
          class="fullscreen-textarea"
          :maxlength="-1"
          placeholder="请输入文件内容"
        />
        <scroll-view v-else class="fullscreen-preview" :scroll-y="true">
          <view v-for="(line, index) in previewLines" :key="index" class="code-line">
            <text class="line-number">{{ index + 1 }}</text>
            <text class="line-content">{{ line || " " }}</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { computed, onMounted, reactive, watch } from "vue";
import {
  DeleteSkills,
  GetSkillDetail,
  PublishSkillDraft,
  SaveSkillDraftFile,
  UpdateSkillBasic,
  UpdateSkillStatus,
} from "@/common/SkillMgr";
import {
  buildSkillTreeNodes,
  findSkillTreeFile,
  formatFileSize,
  formatSkillTextFile,
  getParseStatusMeta,
  getValidateStatusMeta,
} from "@/common/SkillFormatter.mjs";

const props = defineProps({
  skillId: {
    type: [Number, String],
    required: true,
  },
  mode: {
    type: String,
    default: "detail",
  },
});

const emit = defineEmits(["back", "edit", "deleted", "published", "status-change"]);

const state = reactive({
  loading: false,
  savingBasic: false,
  savingFile: false,
  fullscreen: false,
  skill: {},
  form: {
    name: "",
    description: "",
    status: 1,
  },
  activePath: "",
  selectedFile: null,
  editorContent: "",
});

const isEdit = computed(() => props.mode === "edit");
const skillName = computed(() => state.skill.name || "-");
const activePackageTree = computed(() => {
  if (isEdit.value && state.skill.draftPackageTree) {
    return state.skill.draftPackageTree;
  }
  return state.skill.packageTree;
});
const treeRows = computed(() => buildSkillTreeNodes(activePackageTree.value));
const canEditFile = computed(() => isEdit.value && state.selectedFile && state.selectedFile.textFile);
const previewLines = computed(() => (state.editorContent || "").split("\n"));
const editorHint = computed(() => {
  if (!state.selectedFile) {
    return "点击左侧文件可切换内容";
  }
  if (!state.selectedFile.textFile) {
    return "二进制文件仅展示元信息";
  }
  return state.selectedFile.path;
});

onMounted(() => {
  loadSkill();
});

watch(
  () => props.skillId,
  () => loadSkill()
);

watch(
  () => props.mode,
  () => {
    selectPreferredFile();
  }
);

function loadSkill(preferredPath = state.activePath) {
  state.loading = true;
  GetSkillDetail(
    props.skillId,
    (skill) => {
      state.skill = skill || {};
      state.form.name = state.skill.name || "";
      state.form.description = state.skill.description || "";
      state.form.status = Number(state.skill.status) === 0 ? 0 : 1;
      state.loading = false;
      selectPreferredFile(preferredPath);
    },
    (error) => {
      state.loading = false;
      showToast(error || "获取 Skill 详情失败");
    }
  );
}

function selectPreferredFile(preferredPath = state.activePath) {
  const rows = treeRows.value;
  if (preferredPath) {
    const preferred = rows.find((node) => node.path === preferredPath && !node.directory);
    if (preferred) {
      selectNode(preferred);
      return;
    }
  }
  const skillFile = rows.find((node) => node.path === "SKILL.md");
  const firstFile = rows.find((node) => !node.directory);
  selectNode(skillFile || firstFile || null);
}

function selectNode(node) {
  if (!node || node.directory) {
    return;
  }
  const file = findSkillTreeFile(activePackageTree.value, node.path) || node;
  state.activePath = file.path;
  state.selectedFile = file;
  state.editorContent = file.textFile ? file.content || "" : "";
}

function saveBasic() {
  if (!state.form.name.trim()) {
    showToast("Skill 名称不能为空");
    return;
  }
  state.savingBasic = true;
  UpdateSkillBasic(
    {
      id: state.skill.id,
      name: state.form.name.trim(),
      description: state.form.description || "",
      status: state.form.status,
    },
    () => {
      state.savingBasic = false;
      showToast("基础信息已保存", "success");
      loadSkill();
    },
    (error) => {
      state.savingBasic = false;
      showToast(error || "保存基础信息失败");
    }
  );
}

function onStatusSwitch(event) {
  const nextStatus = event.detail.value ? 1 : 0;
  state.form.status = nextStatus;
  UpdateSkillStatus(
    state.skill,
    nextStatus,
    () => {
      state.skill.status = nextStatus;
      emit("status-change");
    },
    (error) => {
      state.form.status = Number(state.skill.status) === 1 ? 1 : 0;
      showToast(error || "更新启用状态失败");
    }
  );
}

function formatCurrentFile() {
  if (!canEditFile.value) {
    return;
  }
  try {
    state.editorContent = formatSkillTextFile(state.selectedFile.path, state.editorContent);
  } catch (error) {
    showToast(error.message || "格式化失败");
  }
}

function saveCurrentFile() {
  if (!canEditFile.value) {
    return;
  }
  state.savingFile = true;
  SaveSkillDraftFile(
    state.skill.id,
    state.selectedFile.path,
    state.editorContent,
    () => {
      state.savingFile = false;
      showToast("草稿已保存", "success");
      loadSkill(state.selectedFile.path);
    },
    (error) => {
      state.savingFile = false;
      showToast(error || "保存草稿失败");
    }
  );
}

function publishDraft() {
  uni.showModal({
    title: "发布更新",
    content: "发布后新版本将用于后续 @Skill 调用，确定发布吗？",
    success: (res) => {
      if (!res.confirm) {
        return;
      }
      PublishSkillDraft(
        state.skill.id,
        () => {
          showToast("发布成功", "success");
          emit("published");
          loadSkill("SKILL.md");
        },
        (error) => {
          showToast(error || "发布失败");
        }
      );
    },
  });
}

function confirmDelete() {
  uni.showModal({
    title: "删除确认",
    content: `确定删除 Skill“${state.skill.name || state.skill.id}”吗？`,
    success: (res) => {
      if (!res.confirm) {
        return;
      }
      DeleteSkills(
        [state.skill.id],
        () => {
          showToast("删除成功", "success");
          emit("deleted");
        },
        (error) => {
          showToast(error || "删除 Skill 失败");
        }
      );
    },
  });
}

function openFullscreen() {
  if (!state.selectedFile) {
    return;
  }
  state.fullscreen = true;
}

function showToast(title, icon = "none") {
  uni.showToast({
    title,
    icon,
    duration: 2000,
  });
}
</script>

<style scoped lang="scss">
.skill-detail-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.detail-header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  min-height: 152rpx;
  padding: 28rpx 36rpx;
  background: #ffffff;
  border-radius: 16rpx;
  box-sizing: border-box;
  box-shadow: 0 4rpx 18rpx rgba(0, 0, 0, 0.06);
}

.title-block {
  display: flex;
  flex-direction: column;
}

.breadcrumb {
  font-size: 24rpx;
  color: #666666;
}

.page-title {
  margin-top: 12rpx;
  font-size: 42rpx;
  font-weight: 700;
  color: #222222;
}

.header-actions,
.editor-actions {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 18rpx;
}

.plain-button,
.primary-button,
.danger-button {
  margin: 0;
  min-width: 144rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  font-size: 24rpx;
  font-weight: 600;
}

.plain-button {
  background: #ffffff;
  border: 2rpx solid #d8dce5;
  color: #333333;
}

.primary-button {
  background: #f8ba38;
  color: #333333;
}

.danger-button {
  background: #fff6f6;
  border: 2rpx solid #ff8f8f;
  color: #ff3b30;
}

.plain-button.small,
.primary-button.small {
  min-width: 120rpx;
  height: 56rpx;
  font-size: 23rpx;
}

.plain-button[disabled],
.primary-button[disabled] {
  opacity: 0.5;
}

.switch-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 12rpx;
  font-size: 24rpx;
  color: #333333;
}

.loading-panel,
.empty-editor {
  flex: 1;
  min-height: 320rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #888888;
  font-size: 26rpx;
}

.detail-content {
  display: grid;
  grid-template-columns: 720rpx minmax(0, 1fr);
  gap: 24rpx;
  flex: 1;
  min-height: 0;
  margin-top: 24rpx;
}

.left-column,
.right-column {
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 18rpx;
}

.panel,
.right-column {
  background: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 18rpx rgba(0, 0, 0, 0.06);
}

.panel {
  padding: 24rpx;
  box-sizing: border-box;
}

.panel-title,
.editor-title text:first-child {
  font-size: 28rpx;
  font-weight: 700;
  color: #222222;
}

.info-list,
.form-list {
  margin-top: 18rpx;
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.info-row,
.form-row {
  display: grid;
  grid-template-columns: 160rpx minmax(0, 1fr);
  align-items: start;
  gap: 16rpx;
}

.info-label,
.form-label,
.meta-label {
  font-size: 24rpx;
  color: #666666;
}

.info-value,
.meta-value {
  min-width: 0;
  font-size: 24rpx;
  color: #222222;
  word-break: break-all;
}

.form-input,
.form-textarea {
  width: 100%;
  border: 2rpx solid #d8dce5;
  border-radius: 8rpx;
  box-sizing: border-box;
  font-size: 24rpx;
  color: #222222;
}

.form-input {
  height: 64rpx;
  padding: 0 18rpx;
}

.form-textarea {
  height: 112rpx;
  padding: 16rpx 18rpx;
}

.save-basic-button {
  align-self: flex-end;
  margin: 0;
  width: 184rpx;
  height: 60rpx;
  border-radius: 8rpx;
  background: #f8ba38;
  font-size: 24rpx;
  font-weight: 600;
  color: #333333;
}

.tree-panel {
  flex: 1;
  min-height: 320rpx;
  display: flex;
  flex-direction: column;
}

.tree-scroll {
  flex: 1;
  min-height: 0;
  margin-top: 16rpx;
}

.tree-row {
  height: 54rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 8rpx;
  font-size: 23rpx;
  color: #333333;
  box-sizing: border-box;
}

.tree-row.active {
  background: #fff2c7;
}

.tree-row.disabled {
  color: #666666;
}

.tree-icon {
  width: 34rpx;
  color: #a66c00;
  font-weight: 700;
}

.tree-name {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tree-size {
  margin-left: 12rpx;
  color: #999999;
  font-size: 20rpx;
}

.check-row {
  margin-top: 16rpx;
  display: grid;
  grid-template-columns: 24rpx 1fr 120rpx;
  align-items: center;
  gap: 12rpx;
}

.status-dot {
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
}

.status-dot.success {
  background: #16a05d;
}

.status-dot.failed {
  background: #ff3b30;
}

.status-dot.pending {
  background: #f5a400;
}

.status-dot.unknown {
  background: #999999;
}

.check-name,
.message-text {
  font-size: 23rpx;
  color: #333333;
}

.check-value {
  font-size: 23rpx;
  text-align: right;
}

.check-value.success {
  color: #16a05d;
}

.check-value.failed {
  color: #ff3b30;
}

.check-value.pending {
  color: #a66c00;
}

.message-text {
  margin-top: 12rpx;
  color: #777777;
}

.meta-grid {
  margin-top: 16rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14rpx 24rpx;
}

.meta-item {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
}

.hash-text {
  font-size: 20rpx;
}

.right-column {
  min-width: 0;
  overflow: hidden;
}

.editor-toolbar,
.fullscreen-toolbar {
  min-height: 80rpx;
  padding: 0 24rpx;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2rpx solid #eeeeee;
}

.editor-title {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.editor-hint {
  margin-top: 6rpx;
  font-size: 21rpx;
  color: #777777;
}

.editor-shell {
  flex: 1;
  min-height: 0;
  padding: 18rpx;
  box-sizing: border-box;
}

.code-textarea,
.preview-scroll {
  width: 100%;
  height: 100%;
  min-height: 0;
  border: 2rpx solid #e4e7ed;
  border-radius: 10rpx;
  box-sizing: border-box;
  background: #fcfcfc;
}

.code-textarea {
  padding: 24rpx;
  font-size: 24rpx;
  line-height: 1.6;
  color: #1f2937;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.preview-scroll {
  padding: 18rpx 0;
}

.code-line {
  display: grid;
  grid-template-columns: 72rpx minmax(0, 1fr);
  min-height: 36rpx;
  font-size: 23rpx;
  line-height: 1.5;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}

.line-number {
  color: #999999;
  text-align: right;
  padding-right: 18rpx;
  user-select: none;
}

.line-content {
  color: #1f2937;
  white-space: pre-wrap;
  word-break: break-word;
}

.binary-meta {
  margin-top: 12rpx;
  font-size: 22rpx;
  color: #777777;
}

.empty-text {
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888888;
  font-size: 24rpx;
}

.fullscreen-mask {
  position: fixed;
  inset: 0;
  z-index: 99;
  padding: 32rpx;
  background: rgba(18, 24, 38, 0.52);
  box-sizing: border-box;
}

.fullscreen-panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 16rpx;
  overflow: hidden;
}

.fullscreen-title {
  font-size: 28rpx;
  font-weight: 700;
  color: #222222;
}

.fullscreen-textarea,
.fullscreen-preview {
  flex: 1;
  min-height: 0;
  margin: 24rpx;
  padding: 24rpx;
  border: 2rpx solid #e4e7ed;
  border-radius: 10rpx;
  box-sizing: border-box;
  font-size: 24rpx;
  line-height: 1.6;
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
}
</style>
