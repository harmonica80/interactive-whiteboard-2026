Add-Type -AssemblyName System.Drawing

Write-Host "=== 1. Checking images/avatars_sheet2.png (1024x768) ==="
$sheet2 = [System.Drawing.Bitmap]::FromFile("images/avatars_sheet2.png")
Write-Host "Dimensions: $($sheet2.Width) x $($sheet2.Height)"

$failCount = 0
for ($c = 1; $c -lt 8; $c++) {
    $x = $c * 128
    $nonTrans = 0
    for ($y = 0; $y -lt 768; $y++) {
        $p = $sheet2.GetPixel($x, $y)
        if ($p.A -gt 0) { $nonTrans++ }
    }
    if ($nonTrans -gt 0) {
        Write-Host "  FAILED: Vertical divider x=$x has $nonTrans non-transparent pixels!"
        $failCount++
    }
}

for ($r = 1; $r -lt 6; $r++) {
    $y = $r * 128
    $nonTrans = 0
    for ($x = 0; $x -lt 1024; $x++) {
        $p = $sheet2.GetPixel($x, $y)
        if ($p.A -gt 0) { $nonTrans++ }
    }
    if ($nonTrans -gt 0) {
        Write-Host "  FAILED: Horizontal divider y=$y has $nonTrans non-transparent pixels!"
        $failCount++
    }
}
$sheet2.Dispose()

if ($failCount -eq 0) {
    Write-Host "  SUCCESS: Zero non-transparent pixels on all cell boundaries in avatars_sheet2.png!"
}

Write-Host "=== 2. Checking individual avatars (48 to 95) ==="
$borderFails = 0
for ($id = 48; $id -le 95; $id++) {
    $path = "images/avatars/avatar_$id.png"
    $a = [System.Drawing.Bitmap]::FromFile($path)
    if ($a.Width -ne 128 -or $a.Height -ne 128) {
        Write-Host "  FAILED: avatar_$id.png size $($a.Width)x$($a.Height) is not 128x128!"
        $borderFails++
    }
    # Check 4 outer edges of 128x128
    $edgeNonTrans = 0
    for ($x = 0; $x -lt 128; $x++) {
        if ($a.GetPixel($x, 0).A -gt 0) { $edgeNonTrans++ }
        if ($a.GetPixel($x, 127).A -gt 0) { $edgeNonTrans++ }
    }
    for ($y = 0; $y -lt 128; $y++) {
        if ($a.GetPixel(0, $y).A -gt 0) { $edgeNonTrans++ }
        if ($a.GetPixel(127, $y).A -gt 0) { $edgeNonTrans++ }
    }
    if ($edgeNonTrans -gt 0) {
        Write-Host "  FAILED: avatar_$id.png has $edgeNonTrans edge pixels!"
        $borderFails++
    }
    $a.Dispose()
}

if ($borderFails -eq 0) {
    Write-Host "  SUCCESS: All 48 avatars (48..95) are 128x128 with clean 100% transparent borders!"
}

Write-Host "=== 3. Checking unified images/avatars_sheet.png (1024x1536) ==="
$fullSheet = [System.Drawing.Bitmap]::FromFile("images/avatars_sheet.png")
Write-Host "Dimensions: $($fullSheet.Width) x $($fullSheet.Height)"

# Check divider between sheet1 and sheet2 at y=768
$y768NonTrans = 0
for ($x = 0; $x -lt 1024; $x++) {
    if ($fullSheet.GetPixel($x, 768).A -gt 0) { $y768NonTrans++ }
}
Write-Host "Divider y=768 non-transparent pixels: $y768NonTrans"
$fullSheet.Dispose()
