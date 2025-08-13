#!/bin/bash

# 文档索引添加脚本
# 用于向项目文档索引添加新条目
# 使用方法: ./index-add-entry.sh "类型" "名称" "路径" "版本" "状态" "备注"

# 检查参数数量
if [ $# -ne 6 ]; then
    echo "使用方法: ./index-add-entry.sh \"类型\" \"名称\" \"路径\" \"版本\" \"状态\" \"备注\""
    exit 1
fi

# 获取参数
TYPE="$1"
NAME="$2"
PATH="$3"
VERSION="$4"
STATUS="$5"
REMARK="$6"

# 获取当前GMT+8时间
TIMESTAMP=$(TZ='Asia/Shanghai' date '+%Y-%m-%d %H:%M:%S GMT+8')

# 生成文档编号 (简单实现，实际应用中可能需要更复杂的逻辑)
DOC_ID="DOC-$(printf "%03d" $(( $(ls -1 docs/plans/*.md 2>/dev/null | wc -l) + 1 )))"

# 检查索引文件是否存在
INDEX_FILE="docs/document-management/project-file-index.md"
if [ ! -f "$INDEX_FILE" ]; then
    # 创建索引文件并添加表头
    echo "# 项目文档索引" > "$INDEX_FILE"
    echo "" >> "$INDEX_FILE"
    echo "**最后更新时间**: $TIMESTAMP" >> "$INDEX_FILE"
    echo "" >> "$INDEX_FILE"
    echo "## 文档索引" >> "$INDEX_FILE"
    echo "" >> "$INDEX_FILE"
    echo "| 编号 | 类型 | 名称 | 路径 | 版本 | 生成时间戳 | 状态 | 备注 |" >> "$INDEX_FILE"
    echo "|------|------|------|------|------|------------|------|------|" >> "$INDEX_FILE"
fi

# 添加新条目到索引文件
echo "| $DOC_ID | $TYPE | $NAME | $PATH | $VERSION | $TIMESTAMP | $STATUS | $REMARK |" >> "$INDEX_FILE"

# 更新最后更新时间
sed -i '' "s/^\*\*最后更新时间\*\*: .*/\*\*最后更新时间\*\*: $TIMESTAMP/" "$INDEX_FILE"

echo "成功添加文档索引条目: $DOC_ID - $NAME"