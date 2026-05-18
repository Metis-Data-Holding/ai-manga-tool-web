/**
 * 从文本中提取角色、场景、道具的结构化信息（兼容所有换行格式）
 * @param {string} text - 原始文本内容
 * @returns {Object} 包含roles、scenes、props的结构化数据
 */
export function extractContentByCategory(text) {
  // 预处理：统一换行符为\n，避免\r\n导致匹配失败
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const result = { roles: [], scenes: [], props: [] };

  // ========== 1. 提取角色信息 ==========
  const roleMatch = normalizedText.match(/角色\n([\s\S]*?)(?=\n场景|$)/);
  if (roleMatch && roleMatch[1]) {
    result.roles = parseItems(roleMatch[1], 'role');
  }

  // ========== 2. 提取场景信息 ==========
  const sceneMatch = normalizedText.match(/场景\n([\s\S]*?)(?=\n道具|$)/);
  if (sceneMatch && sceneMatch[1]) {
    result.scenes = parseItems(sceneMatch[1], 'scene');
  }

  // ========== 3. 提取道具信息 ==========
  const propMatch = normalizedText.match(/道具\n([\s\S]*?)$/);
  if (propMatch && propMatch[1]) {
    result.props = parseItems(propMatch[1], 'prop');
  }

  return result;
}

/**
 * 通用解析函数：解析角色/场景/道具的子项
 * @param {string} content - 分类下的文本
 * @param {string} type - 类型：role/scene/prop
 * @returns {Array} 解析后的子项列表
 */
function parseItems(content, type) {
  const items = [];
  // 匹配单个子项：数字 + 名称 + 所有详情（兼容任意换行）
  const itemRegex = /(\d+)\n([^\n]+)\n([\s\S]*?)(?=\n\d+\n|$)/g;
  let match;

  while ((match = itemRegex.exec(content)) !== null) {
    const index = Number(match[1].trim());
    const name = match[2].trim();
    const detail = match[3].trim();

    // 提取通用字段
    const style = extractFieldWithPrefix(detail, '风格及光线：');
    const outputReq = extractFieldWithPrefix(detail, '输出要求：');
    const mainContent = extractFieldWithPrefix(detail, '主体内容：');
    const coreFeature = extractFieldWithPrefix(detail, '核心特征：');

    const item = { index, name, style, outputReq, mainContent,coreFeature };

    // 角色专属：提取音色、核心特征
    if (type === 'role') {
        // const voiceTruncateRegex = new RegExp(`${name}音色[\\s\\S]*`);
        // const cleanDetailForMain = detail.replace(voiceTruncateRegex, '').trim();
        // mainContent=extractFieldWithPrefix(cleanDetailForMain, '主体内容：');
        const voiceData = extractVoiceField(detail, name);
        item.voicename = voiceData.voicename; // 如：赵虎音色
        item.voice = voiceData.voice;         // 如：青年男声，中音域..
        item.mainContent= item.mainContent.replace(voiceData.voicename,'').replace(voiceData.voice,'').trim();
        item.coreFeature = item.coreFeature.replace('核心特征：','').trim();
    }

    items.push(item);
  }

  return items;
}

function extractVoiceField(content, roleName) {
  // 匹配 "角色名+音色" 作为voicename，后续内容作为voice
  const voiceRegex = new RegExp(`(${roleName}音色)\\n([\\s\\S]*?)(?=\\n[^：]+：|$)`);
  const voiceMatch = content.match(voiceRegex);
  
  if (voiceMatch) {
    return {
      voicename: voiceMatch[1].trim(), // 音色名称（如：赵虎音色）
      voice: voiceMatch[2].trim()      // 音色详情（如：青年男声...）
    };
  }
  // 未匹配到返回空字符串
  return { voicename: '', voice: '' };
}

/**
 * 通用字段提取：兼容任意换行/空格
 * @param {string} content - 详情文本
 * @param {string} field - 字段标识（如"风格及光线："）
 * @returns {string} 提取的内容
 */
function extractField(content, field) {
  // 转义特殊字符，确保正则匹配准确
  const escapedField = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${escapedField}([\\s\\S]*?)(?=\\n[^：]+：|$)`, 'g');
  const match = content.match(regex);
  return match ? match[0].replace(escapedField, '').trim() : '';
}

function extractFieldWithPrefix(content, field) {
  // 转义特殊字符，确保正则匹配准确
  const escapedField = field.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`${escapedField}([\\s\\S]*?)(?=\\n[^：]+：|$)`, 'g');
  const match = content.match(regex);
  // 保留前缀：匹配结果 + 前缀，而非只返回内容
  return match ? (field + match[0].replace(escapedField, '').trim()) : '';
}
