export const SKILL_UPLOAD_EXTENSIONS = [".zip", ".tar", ".tar.gz", ".tgz"];

function hasValue(value) {
  return value !== undefined && value !== null && value !== "";
}

export function buildSkillListQuery(params = {}) {
  const query = [];
  const pageNum = params.pageNum || 1;
  const pageSize = params.pageSize || 10;
  query.push(`pageNum=${encodeURIComponent(pageNum)}`);
  query.push(`pageSize=${encodeURIComponent(pageSize)}`);

  ["keyword", "status", "parseStatus", "validateStatus"].forEach((key) => {
    const value = typeof params[key] === "string" ? params[key].trim() : params[key];
    if (hasValue(value)) {
      query.push(`${key}=${encodeURIComponent(value)}`);
    }
  });

  return query.join("&");
}

export function getSkillStatusMeta(status) {
  if (Number(status) === 1) {
    return { text: "已启用", className: "enabled" };
  }
  if (Number(status) === 0) {
    return { text: "已停用", className: "disabled" };
  }
  return { text: "未知", className: "unknown" };
}

export function getParseStatusMeta(status) {
  if (Number(status) === 1) {
    return { text: "解析成功", className: "success" };
  }
  if (Number(status) === -1) {
    return { text: "解析失败", className: "failed" };
  }
  if (Number(status) === 0) {
    return { text: "待解析", className: "pending" };
  }
  return { text: "未知", className: "unknown" };
}

export function getValidateStatusMeta(status) {
  if (Number(status) === 1) {
    return { text: "校验通过", className: "success" };
  }
  if (Number(status) === -1) {
    return { text: "校验失败", className: "failed" };
  }
  if (Number(status) === 0) {
    return { text: "待校验", className: "pending" };
  }
  return { text: "未知", className: "unknown" };
}

export function summarizeSkills(skills = []) {
  return skills.reduce(
    (summary, skill) => {
      summary.total += 1;
      if (Number(skill.status) === 1) {
        summary.enabled += 1;
      }
      if (Number(skill.status) === 0) {
        summary.disabled += 1;
      }
      if (Number(skill.validateStatus) !== 1) {
        summary.pendingValidate += 1;
      }
      return summary;
    },
    { total: 0, enabled: 0, disabled: 0, pendingValidate: 0 }
  );
}

export function isSupportedSkillPackage(fileName = "") {
  const lowerName = fileName.toLowerCase();
  return SKILL_UPLOAD_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
}

export function formatFileSize(size) {
  const numberSize = Number(size);
  if (!Number.isFinite(numberSize) || numberSize <= 0) {
    return "-";
  }
  if (numberSize < 1024) {
    return `${numberSize} B`;
  }
  if (numberSize < 1024 * 1024) {
    return `${(numberSize / 1024).toFixed(1)} KB`;
  }
  return `${(numberSize / 1024 / 1024).toFixed(1)} MB`;
}

export function parseSkillPackageTree(packageTree) {
  if (Array.isArray(packageTree)) {
    return packageTree;
  }
  if (!packageTree || typeof packageTree !== "string") {
    return [];
  }
  try {
    const parsed = JSON.parse(packageTree);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

export function buildSkillTreeNodes(packageTree) {
  const files = parseSkillPackageTree(packageTree).filter((node) => node && node.path);
  const byPath = new Map();

  files.forEach((file) => {
    const parts = String(file.path).split("/").filter(Boolean);
    parts.forEach((part, index) => {
      const path = parts.slice(0, index + 1).join("/");
      if (index < parts.length - 1 && !byPath.has(path)) {
        byPath.set(path, {
          path,
          name: part,
          depth: index,
          directory: true,
          textFile: false,
          size: 0,
          content: null,
        });
      }
    });

    const fileName = parts[parts.length - 1] || file.path;
    byPath.set(file.path, {
      ...file,
      name: fileName,
      depth: Math.max(0, parts.length - 1),
      directory: Boolean(file.directory),
      textFile: Boolean(file.textFile),
    });
  });

  return Array.from(byPath.values()).sort(compareSkillTreeNode);
}

export function findSkillTreeFile(packageTree, path) {
  return parseSkillPackageTree(packageTree).find((node) => node && node.path === path) || null;
}

export function formatSkillTextFile(path, content) {
  const text = content == null ? "" : String(content);
  if (String(path || "").toLowerCase().endsWith(".json")) {
    return `${JSON.stringify(JSON.parse(text), null, 2)}\n`;
  }
  return normalizeTextFile(text);
}

function normalizeTextFile(content) {
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  return `${normalized
    .split("\n")
    .map((line) => line.replace(/[ \t]+$/g, ""))
    .join("\n")
    .replace(/\n*$/g, "")}\n`;
}

function compareSkillTreeNode(left, right) {
  if (left.path === "SKILL.md") {
    return -1;
  }
  if (right.path === "SKILL.md") {
    return 1;
  }
  if (left.path === right.path) {
    return 0;
  }
  return left.path.localeCompare(right.path);
}
