<template>
  <view class="skill-page">
    <SkillDetailEditor
      v-if="state.viewMode !== 'list' && state.currentSkillId"
      :skill-id="state.currentSkillId"
      :mode="state.viewMode"
      @back="backToList"
      @edit="openEdit"
      @deleted="handleDetailDeleted"
      @published="handleDetailPublished"
      @status-change="handleDetailStatusChange"
    />
    <template v-else>
    <view class="skill-header">
      <text class="skill-title">SKILL 管理</text>
      <view class="skill-tabs">
        <view
          v-for="tab in statusTabs"
          :key="tab.value"
          :class="['skill-tab', { active: state.activeStatusTab === tab.value }]"
          @click="changeStatusTab(tab.value)"
        >
          {{ tab.label }}
        </view>
      </view>
    </view>

    <view class="upload-panel" @click="pickSkillPackage">
      <image src="/static/upload.png" class="upload-icon" mode="aspectFit"></image>
      <view class="upload-copy">
        <text class="upload-title">拖拽 SKILL 压缩包到此处，或</text>
        <button class="upload-button" :disabled="state.uploading" @click.stop="pickSkillPackage">
          {{ state.uploading ? "上传中" : "上传SKILL压缩包" }}
        </button>
        <text class="upload-hint">支持 .zip、.tar、.tar.gz、.tgz 格式，系统将自动解析并完成校验与入库。</text>
      </view>
    </view>

    <view class="stats-grid">
      <view class="stat-card">
        <view class="stat-icon blue">▣</view>
        <view class="stat-content">
          <text class="stat-label">总 SKILL</text>
          <text class="stat-value">{{ state.summary.total }}</text>
          <text class="stat-sub">全部已安装</text>
        </view>
      </view>
      <view class="stat-card">
        <view class="stat-icon green">✓</view>
        <view class="stat-content">
          <text class="stat-label">已启用</text>
          <text class="stat-value">{{ state.summary.enabled }}</text>
          <text class="stat-sub">占比 {{ percent(state.summary.enabled, state.summary.total) }}</text>
        </view>
      </view>
      <view class="stat-card">
        <view class="stat-icon orange">Ⅱ</view>
        <view class="stat-content">
          <text class="stat-label">已停用</text>
          <text class="stat-value">{{ state.summary.disabled }}</text>
          <text class="stat-sub">占比 {{ percent(state.summary.disabled, state.summary.total) }}</text>
        </view>
      </view>
      <view class="stat-card">
        <view class="stat-icon purple">!</view>
        <view class="stat-content">
          <text class="stat-label">待校验</text>
          <text class="stat-value">{{ state.summary.pendingValidate }}</text>
          <text class="stat-sub">占比 {{ percent(state.summary.pendingValidate, state.summary.total) }}</text>
        </view>
      </view>
    </view>

    <view class="table-panel">
      <view class="filter-row">
        <view class="skill-search">
          <input
            v-model="state.keyword"
            class="skill-search-input"
            confirm-type="search"
            placeholder="搜索 SKILL 名称或描述"
            @confirm="applyFilters"
          />
          <image src="/static/searchicon.png" class="skill-search-icon" mode="aspectFit" @click="applyFilters"></image>
        </view>
        <view class="filter-item">
          <text class="filter-label">状态</text>
          <picker :range="statusOptions" range-key="label" :value="state.statusIndex" @change="onStatusFilterChange">
            <view class="select-box">{{ statusOptions[state.statusIndex].label }}</view>
          </picker>
        </view>
        <view class="filter-item">
          <text class="filter-label">解析状态</text>
          <picker :range="parseOptions" range-key="label" :value="state.parseIndex" @change="onParseFilterChange">
            <view class="select-box">{{ parseOptions[state.parseIndex].label }}</view>
          </picker>
        </view>
        <view class="filter-item">
          <text class="filter-label">校验状态</text>
          <picker :range="validateOptions" range-key="label" :value="state.validateIndex" @change="onValidateFilterChange">
            <view class="select-box">{{ validateOptions[state.validateIndex].label }}</view>
          </picker>
        </view>
        <view class="filter-item sort-filter">
          <text class="filter-label">排序</text>
          <view class="select-box">更新时间</view>
        </view>
        <button class="batch-button" :disabled="state.selectedIds.length === 0" @click="confirmBatchDelete">
          批量删除
        </button>
      </view>

      <view class="skill-table">
        <view class="table-row table-head">
          <view class="cell check-cell" @click="toggleSelectAll">
            <view :class="['fake-check', { checked: selectedAll }]"></view>
          </view>
          <view class="cell name-cell">SKILL 名称</view>
          <view class="cell desc-cell">描述</view>
          <view class="cell version-cell">版本</view>
          <view class="cell source-cell">来源文件</view>
          <view class="cell time-cell">更新时间 ↓</view>
          <view class="cell state-cell">启用状态</view>
          <view class="cell state-cell">解析状态</view>
          <view class="cell state-cell">校验状态</view>
          <view class="cell enable-cell">启用</view>
          <view class="cell action-cell">操作</view>
        </view>

        <scroll-view class="table-body" :scroll-y="true">
          <view v-if="state.loading" class="empty-row">加载中...</view>
          <view v-else-if="state.skills.length === 0" class="empty-row">暂无 SKILL</view>
          <block v-else>
            <view v-for="item in state.skills" :key="item.id" class="table-row">
              <view class="cell check-cell" @click="toggleSelect(item.id)">
                <view :class="['fake-check', { checked: state.selectedIds.includes(item.id) }]"></view>
              </view>
              <view class="cell name-cell">
                <text class="skill-name">{{ item.name || "-" }}</text>
                <text class="skill-meta">{{ formatFileSize(item.packageSize) }} · {{ item.fileCount || 0 }} 文件</text>
              </view>
              <view class="cell desc-cell ellipsis">{{ item.description || "-" }}</view>
              <view class="cell version-cell">v{{ item.version || 1 }}</view>
              <view class="cell source-cell ellipsis">{{ item.originalFileName || "-" }}</view>
              <view class="cell time-cell">{{ item.updateTime || item.createTime || "-" }}</view>
              <view class="cell state-cell">
                <text :class="['status-pill', getSkillStatusMeta(item.status).className]">{{ getSkillStatusMeta(item.status).text }}</text>
              </view>
              <view class="cell state-cell">
                <text :class="['status-dot', getParseStatusMeta(item.parseStatus).className]"></text>
                <text :class="['status-text', getParseStatusMeta(item.parseStatus).className]">{{ getParseStatusMeta(item.parseStatus).text }}</text>
              </view>
              <view class="cell state-cell">
                <text :class="['status-dot', getValidateStatusMeta(item.validateStatus).className]"></text>
                <text :class="['status-text', getValidateStatusMeta(item.validateStatus).className]">{{ getValidateStatusMeta(item.validateStatus).text }}</text>
              </view>
              <view class="cell enable-cell">
                <switch :checked="Number(item.status) === 1" color="#F8BA38" @change="onToggleSkill(item, $event)" />
              </view>
              <view class="cell action-cell">
                <text class="action-link" @click="openDetail(item.id)">详情</text>
                <text class="action-link" @click="openEdit(item.id)">编辑</text>
                <text class="delete-link" @click="confirmDelete(item)">删除</text>
              </view>
            </view>
          </block>
        </scroll-view>
      </view>

      <view class="pagination-row">
        <text class="total-text">共 {{ state.total }} 条</text>
        <picker :range="pageSizeOptions" :value="state.pageSizeIndex" @change="onPageSizeChange">
          <view class="page-size">{{ state.pageSize }} 条/页</view>
        </picker>
        <button class="page-button" :disabled="state.pageNum <= 1" @click="changePage(state.pageNum - 1)">‹</button>
        <text class="page-current">{{ state.pageNum }}</text>
        <button class="page-button" :disabled="state.pageNum >= totalPages" @click="changePage(state.pageNum + 1)">›</button>
        <text class="page-total">共 {{ totalPages }} 页</text>
      </view>
    </view>
    </template>
  </view>
</template>

<script setup>
import { computed, onMounted, reactive } from "vue";
import SkillDetailEditor from "@/components/SkillDetailEditor.vue";
import {
  DeleteSkills,
  GetSkillList,
  InstallSkillPackage,
  UpdateSkillStatus,
  refreshSkillTokenFromCache,
} from "@/common/SkillMgr";
import {
  formatFileSize,
  getParseStatusMeta,
  getSkillStatusMeta,
  getValidateStatusMeta,
  isSupportedSkillPackage,
  summarizeSkills,
} from "@/common/SkillFormatter.mjs";

const statusTabs = [
  { label: "全部", value: "" },
  { label: "已启用", value: 1 },
  { label: "已停用", value: 0 },
];

const statusOptions = [
  { label: "全部", value: "" },
  { label: "已启用", value: 1 },
  { label: "已停用", value: 0 },
];

const parseOptions = [
  { label: "全部", value: "" },
  { label: "解析成功", value: 1 },
  { label: "待解析", value: 0 },
  { label: "解析失败", value: -1 },
];

const validateOptions = [
  { label: "全部", value: "" },
  { label: "校验通过", value: 1 },
  { label: "待校验", value: 0 },
  { label: "校验失败", value: -1 },
];

const pageSizeOptions = [10, 20, 50];

const state = reactive({
  activeStatusTab: "",
  statusIndex: 0,
  parseIndex: 0,
  validateIndex: 0,
  keyword: "",
  skills: [],
  total: 0,
  pageNum: 1,
  pageSize: 10,
  pageSizeIndex: 0,
  selectedIds: [],
  loading: false,
  uploading: false,
  viewMode: "list",
  currentSkillId: null,
  summary: {
    total: 0,
    enabled: 0,
    disabled: 0,
    pendingValidate: 0,
  },
});

const selectedAll = computed(() => {
  return state.skills.length > 0 && state.skills.every((item) => state.selectedIds.includes(item.id));
});

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(state.total / state.pageSize));
});

onMounted(() => {
  refreshSkillTokenFromCache();
  loadSkills();
  loadSummary();
});

function loadSkills() {
  state.loading = true;
  GetSkillList(
    {
      pageNum: state.pageNum,
      pageSize: state.pageSize,
      keyword: state.keyword,
      status: statusOptions[state.statusIndex].value,
      parseStatus: parseOptions[state.parseIndex].value,
      validateStatus: validateOptions[state.validateIndex].value,
    },
    (result) => {
      state.skills = result.rows;
      state.total = result.total;
      state.selectedIds = state.selectedIds.filter((id) => state.skills.some((item) => item.id === id));
      state.loading = false;
    },
    (error) => {
      state.loading = false;
      showToast(error || "获取 Skill 列表失败");
    }
  );
}

function loadSummary() {
  GetSkillList(
    { pageNum: 1, pageSize: 10000 },
    (result) => {
      state.summary = summarizeSkills(result.rows);
    },
    () => {}
  );
}

function applyFilters() {
  state.pageNum = 1;
  loadSkills();
}

function changeStatusTab(value) {
  state.activeStatusTab = value;
  state.statusIndex = statusOptions.findIndex((item) => item.value === value);
  applyFilters();
}

function onStatusFilterChange(event) {
  state.statusIndex = Number(event.detail.value);
  state.activeStatusTab = statusOptions[state.statusIndex].value;
  applyFilters();
}

function onParseFilterChange(event) {
  state.parseIndex = Number(event.detail.value);
  applyFilters();
}

function onValidateFilterChange(event) {
  state.validateIndex = Number(event.detail.value);
  applyFilters();
}

function onPageSizeChange(event) {
  state.pageSizeIndex = Number(event.detail.value);
  state.pageSize = pageSizeOptions[state.pageSizeIndex];
  state.pageNum = 1;
  loadSkills();
}

function changePage(pageNum) {
  if (pageNum < 1 || pageNum > totalPages.value) {
    return;
  }
  state.pageNum = pageNum;
  loadSkills();
}

function toggleSelect(id) {
  if (state.selectedIds.includes(id)) {
    state.selectedIds = state.selectedIds.filter((item) => item !== id);
    return;
  }
  state.selectedIds.push(id);
}

function toggleSelectAll() {
  if (selectedAll.value) {
    state.selectedIds = [];
    return;
  }
  state.selectedIds = state.skills.map((item) => item.id);
}

function pickSkillPackage() {
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
    extension: ["zip", "tar", "gz", "tgz"],
    success: (res) => {
      const file = (res.tempFiles && res.tempFiles[0]) || {};
      const filePath = file.path || file.tempFilePath || (res.tempFilePaths && res.tempFilePaths[0]);
      const fileName = file.name || (filePath ? filePath.split("/").pop() : "");
      uploadSkillPackage(filePath, fileName);
    },
  });
}

function uploadSkillPackage(filePath, fileName) {
  if (!filePath) {
    showToast("未读取到待上传文件");
    return;
  }
  if (!isSupportedSkillPackage(fileName || filePath)) {
    showToast("仅支持 .zip、.tar、.tar.gz、.tgz 格式");
    return;
  }
  state.uploading = true;
  uni.showLoading({
    title: "安装中",
    mask: true,
  });
  InstallSkillPackage(
    filePath,
    fileName,
    () => {
      uni.hideLoading();
      state.uploading = false;
      showToast("安装成功", "success");
      state.pageNum = 1;
      loadSkills();
      loadSummary();
    },
    (error) => {
      uni.hideLoading();
      state.uploading = false;
      showToast(error || "安装 Skill 失败");
    }
  );
}

function onToggleSkill(skill, event) {
  const nextStatus = event.detail.value ? 1 : 0;
  UpdateSkillStatus(
    skill,
    nextStatus,
    () => {
      skill.status = nextStatus;
      loadSummary();
    },
    (error) => {
      showToast(error || "更新启用状态失败");
      loadSkills();
    }
  );
}

function confirmDelete(skill) {
  uni.showModal({
    title: "删除确认",
    content: `确定删除 Skill“${skill.name || skill.id}”吗？`,
    success: (res) => {
      if (res.confirm) {
        deleteSkills([skill.id]);
      }
    },
  });
}

function confirmBatchDelete() {
  if (state.selectedIds.length === 0) {
    return;
  }
  uni.showModal({
    title: "批量删除",
    content: `确定删除已选择的 ${state.selectedIds.length} 个 Skill 吗？`,
    success: (res) => {
      if (res.confirm) {
        deleteSkills([...state.selectedIds]);
      }
    },
  });
}

function deleteSkills(ids) {
  DeleteSkills(
    ids,
    () => {
      showToast("删除成功", "success");
      state.selectedIds = [];
      loadSkills();
      loadSummary();
    },
    (error) => {
      showToast(error || "删除 Skill 失败");
    }
  );
}

function openDetail(id) {
  state.currentSkillId = id;
  state.viewMode = "detail";
}

function openEdit(id) {
  state.currentSkillId = id;
  state.viewMode = "edit";
}

function backToList() {
  state.viewMode = "list";
  state.currentSkillId = null;
  loadSkills();
  loadSummary();
}

function handleDetailDeleted() {
  backToList();
}

function handleDetailPublished() {
  loadSummary();
}

function handleDetailStatusChange() {
  loadSummary();
}

function percent(value, total) {
  if (!total) {
    return "0%";
  }
  return `${((value / total) * 100).toFixed(1)}%`;
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
.skill-page {
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  padding: 48rpx 48rpx 24rpx;
  box-sizing: border-box;
  overflow: hidden;
}

.skill-header {
  display: flex;
  flex-direction: column;
}

.skill-title {
  font-size: 48rpx;
  font-weight: 700;
  color: #222222;
}

.skill-tabs {
  display: flex;
  flex-direction: row;
  margin-top: 34rpx;
  width: 560rpx;
  height: 72rpx;
  overflow: hidden;
  border-radius: 12rpx;
  background: #e7e7e7;
}

.skill-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 600;
  color: #333333;
}

.skill-tab.active {
  background: #f8ba38;
}

.upload-panel {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 36rpx;
  min-height: 160rpx;
  padding: 28rpx 56rpx;
  border: 2rpx dashed #b8b8b8;
  border-radius: 16rpx;
  background: #ffffff;
  box-sizing: border-box;
}

.upload-icon {
  width: 104rpx;
  height: 104rpx;
  margin-right: 42rpx;
}

.upload-copy {
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap;
  flex: 1;
}

.upload-title {
  font-size: 32rpx;
  color: #333333;
  font-weight: 700;
  margin-right: 24rpx;
}

.upload-button {
  margin: 0;
  width: 280rpx;
  height: 72rpx;
  border-radius: 12rpx;
  background: #f8ba38;
  color: #333333;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 600;
}

.upload-hint {
  width: 100%;
  margin-top: 18rpx;
  font-size: 24rpx;
  color: #666666;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 32rpx;
  margin-top: 28rpx;
}

.stat-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  min-height: 152rpx;
  padding: 30rpx 36rpx;
  background: #ffffff;
  border-radius: 16rpx;
  box-sizing: border-box;
  box-shadow: 0 4rpx 18rpx rgba(0, 0, 0, 0.06);
}

.stat-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 28rpx;
  color: #ffffff;
  font-size: 34rpx;
  font-weight: 700;
}

.stat-icon.blue {
  background: #5f7df7;
}

.stat-icon.green {
  background: #35c783;
}

.stat-icon.orange {
  background: #ff9a3c;
}

.stat-icon.purple {
  background: #8c5cff;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 24rpx;
  color: #666666;
}

.stat-value {
  margin-top: 6rpx;
  font-size: 40rpx;
  font-weight: 700;
  color: #222222;
}

.stat-sub {
  margin-top: 4rpx;
  font-size: 22rpx;
  color: #777777;
}

.table-panel {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  margin-top: 24rpx;
  background: #ffffff;
  border-radius: 16rpx;
  box-shadow: 0 4rpx 18rpx rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.filter-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 22rpx;
  padding: 24rpx;
  border-bottom: 2rpx solid #eeeeee;
}

.skill-search {
  width: 420rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  background: #f7f7f7;
  border: 2rpx solid #e0e0e0;
  border-radius: 8rpx;
}

.skill-search-input {
  flex: 1;
  height: 64rpx;
  padding-left: 20rpx;
  font-size: 24rpx;
}

.skill-search-icon {
  width: 32rpx;
  height: 32rpx;
  padding: 16rpx;
}

.filter-item {
  display: flex;
  flex-direction: row;
  align-items: center;
}

.filter-label {
  margin-right: 12rpx;
  font-size: 24rpx;
  color: #333333;
}

.select-box {
  width: 176rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #d8dce5;
  border-radius: 8rpx;
  color: #333333;
  font-size: 24rpx;
  background: #ffffff;
}

.sort-filter .select-box {
  width: 188rpx;
}

.batch-button {
  margin: 0 0 0 auto;
  width: 176rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  background: #f8ba38;
  color: #333333;
  font-size: 24rpx;
  font-weight: 600;
}

.batch-button[disabled] {
  background: #eeeeee;
  color: #999999;
}

.skill-table {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
}

.table-body {
  flex: 1;
  min-height: 0;
}

.table-row {
  display: grid;
  grid-template-columns: 64rpx 300rpx 360rpx 120rpx 300rpx 260rpx 180rpx 210rpx 210rpx 140rpx 240rpx;
  min-height: 88rpx;
  align-items: center;
  border-bottom: 2rpx solid #eeeeee;
}

.table-head {
  min-height: 72rpx;
  background: #fbfbfb;
  color: #333333;
  font-weight: 700;
}

.cell {
  min-width: 0;
  padding: 0 16rpx;
  box-sizing: border-box;
  font-size: 24rpx;
  color: #333333;
}

.check-cell {
  display: flex;
  justify-content: center;
}

.fake-check {
  width: 28rpx;
  height: 28rpx;
  border: 2rpx solid #cfd4dc;
  border-radius: 6rpx;
  background: #ffffff;
}

.fake-check.checked {
  border-color: #f8ba38;
  background: #f8ba38;
}

.name-cell {
  display: flex;
  flex-direction: column;
}

.skill-name {
  font-size: 25rpx;
  font-weight: 600;
  color: #222222;
}

.skill-meta {
  margin-top: 6rpx;
  font-size: 20rpx;
  color: #888888;
}

.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.status-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 92rpx;
  height: 40rpx;
  padding: 0 12rpx;
  border-radius: 8rpx;
  font-size: 22rpx;
}

.status-pill.enabled {
  color: #16a05d;
  border: 2rpx solid #abebc7;
  background: #f1fff7;
}

.status-pill.disabled {
  color: #e16a19;
  border: 2rpx solid #ffd1ad;
  background: #fff7f0;
}

.status-pill.unknown {
  color: #666666;
  border: 2rpx solid #dddddd;
  background: #f7f7f7;
}

.status-dot {
  display: inline-block;
  width: 14rpx;
  height: 14rpx;
  border-radius: 50%;
  margin-right: 10rpx;
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

.status-text {
  font-size: 23rpx;
}

.status-text.success {
  color: #246f45;
}

.status-text.failed {
  color: #e63946;
}

.status-text.pending {
  color: #a66c00;
}

.delete-link {
  color: #ff4d4f;
  font-size: 24rpx;
}

.action-cell {
  display: flex;
  flex-direction: row;
  gap: 18rpx;
}

.action-link {
  color: #2563eb;
  font-size: 24rpx;
}

.empty-row {
  height: 180rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888888;
  font-size: 26rpx;
}

.pagination-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  min-height: 88rpx;
  padding: 0 24rpx;
  gap: 18rpx;
}

.total-text {
  margin-right: auto;
  color: #666666;
  font-size: 24rpx;
}

.page-size,
.page-current,
.page-total {
  color: #333333;
  font-size: 24rpx;
}

.page-size,
.page-current {
  min-width: 96rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid #d8dce5;
  border-radius: 8rpx;
}

.page-current {
  min-width: 56rpx;
  border-color: #f8ba38;
}

.page-button {
  margin: 0;
  width: 56rpx;
  height: 56rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8rpx;
  background: #ffffff;
  border: 2rpx solid #d8dce5;
  color: #333333;
}
</style>
