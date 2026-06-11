#!/bin/bash
# ============================================================
# CuongHoangDev - Setup 4GB Swap on VPS
# ============================================================
set -euo pipefail

SWAP_FILE="/swapfile"
SWAP_SIZE="4G"
FSTAB_LINE="/swapfile none swap sw 0 0"

echo "============================================"
echo "  Setting up ${SWAP_SIZE} SWAP on VPS"
echo "============================================"
echo ""

# ── Step 1: Detect existing swap ─────────────────────────────
echo "[1/7] Checking for existing swap..."
if swapon --show | grep -q "${SWAP_FILE}"; then
    echo "  Swap file '${SWAP_FILE}' is already active."
    echo "  Aborting to prevent double allocation."
    free -h
    exit 0
fi
if [ -f "${SWAP_FILE}" ]; then
    echo "  Swap file exists but is not active."
    echo "  Removing stale file to recreate cleanly..."
    swapoff "${SWAP_FILE}" 2>/dev/null || true
    rm -f "${SWAP_FILE}"
fi
echo "  No active swap detected. Proceeding."
echo ""

# ── Step 2: Allocate swap file ──────────────────────────────
echo "[2/7] Allocating ${SWAP_SIZE} swap file..."
if fallocate -l "${SWAP_SIZE}" "${SWAP_FILE}" 2>/dev/null; then
    echo "  Allocated via fallocate."
else
    echo "  fallocate failed (filesystem may not support it)."
    echo "  Falling back to dd..."
    if dd if=/dev/zero of="${SWAP_FILE}" bs=1M count=4096 status=progress; then
        echo "  Allocated via dd."
    else
        echo "  ERROR: Failed to allocate swap file."
        exit 1
    fi
fi
echo ""

# ── Step 3: Secure permissions ──────────────────────────────
echo "[3/7] Locking down swap file permissions (600)..."
chmod 600 "${SWAP_FILE}"
PERMS=$(stat -c "%a" "${SWAP_FILE}")
if [ "${PERMS}" = "600" ]; then
    echo "  Permissions set to 600."
else
    echo "  ERROR: Permissions are ${PERMS}, expected 600."
    exit 1
fi
echo ""

# ── Step 4: Format as swap ─────────────────────────────────
echo "[4/7] Formatting as Linux swap space..."
if mkswap "${SWAP_FILE}" >/dev/null 2>&1; then
    echo "  Swap space formatted successfully."
else
    echo "  ERROR: Failed to format swap."
    exit 1
fi
echo ""

# ── Step 5: Enable swap ────────────────────────────────────
echo "[5/7] Enabling swap in the running kernel..."
if swapon "${SWAP_FILE}" 2>/dev/null; then
    echo "  Swap enabled."
else
    echo "  ERROR: Failed to enable swap."
    exit 1
fi
echo ""

# ── Step 6: Persist across reboots ─────────────────────────
echo "[6/7] Making swap persistent across reboots..."
if grep -q "^${FSTAB_LINE}$" /etc/fstab 2>/dev/null; then
    echo "  /etc/fstab already contains the swap entry. Skipping."
else
    echo "${FSTAB_LINE}" >> /etc/fstab
    echo "  Added to /etc/fstab."
fi
echo ""

# ── Step 7: Final memory architecture matrix ───────────────
echo "[7/7] Live memory architecture matrix:"
echo ""
free -h
echo ""

SWAP_TOTAL=$(free -h --si | awk 'NR==3{print $2}')
echo "============================================"
echo "  SWAP Setup Complete!"
echo "  Swap total: ${SWAP_TOTAL}"
echo "  Total memory (RAM + Swap): verified above"
echo "============================================"
