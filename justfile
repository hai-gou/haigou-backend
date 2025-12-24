# 使用 `just` 驱动 Docker Compose，简化本地开发与联调流程

set shell := ['bash', '-uo', 'pipefail', '-c']
set dotenv-load := true

compose := 'docker compose'
default_service := 'backend'

alias u := up
alias un := up-no-build
alias d := down
alias l := logs
alias r := restart
alias s := status
alias c := cleanup
alias i := install
alias b := build
alias pr := pre-run

# 默认任务：一次性启动并输出状态
_default: run

run:
	just up
	just status
	@echo '服务后台运行中，可执行 `just logs` 查看实时日志'

# 构建镜像，确保依赖更新
build:
	{{compose}} build {{default_service}}

# 启动服务并强制构建
up: pre-run
	{{compose}} up -d --build --remove-orphans

# 启动服务（跳过构建，加快热更新）
up-no-build: pre-run
	{{compose}} up -d --remove-orphans

# 关闭并清理容器、网络（保留数据卷）
down:
	{{compose}} down --remove-orphans

# 持续查看指定服务日志
logs service=default_service:
	{{compose}} logs -f {{service}}

# 重启指定服务或全量重启
restart service=default_service:
	{{compose}} restart {{service}}

# 查看当前容器状态
status:
	{{compose}} ps

# 进入容器 Shell，便于排查
shell service=default_service:
	{{compose}} exec {{service}} /bin/bash

# 全新安装依赖（借助 volume 缓存）
install:
	{{compose}} run --rm {{default_service}} npm ci --omit=dev

# 仅启动后端前台进程用于调试
dev:
	{{compose}} up {{default_service}}

# 停止并删除数据卷，彻底清理
cleanup:
	{{compose}} down -v --remove-orphans

# 启动前置步骤：清空 logs 目录，防止日志堆积
pre-run:
	@echo '=== 清理 logs 目录，保证启动日志干净 ==='
	@mkdir -p logs
	@if find logs -mindepth 1 -delete 2>/dev/null; then \
		echo '>>> 已清空 logs/ 目录'; \
	else \
		echo '>>> logs/ 目录无需清理或无权限删除'; \
	fi
