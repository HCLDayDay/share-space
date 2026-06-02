/**
 * Download original preset/seed images from initialData URLs to seed-images/
 * Run: npx tsx scripts/download-seed-images.ts
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_DIR = path.join(__dirname, '..', 'seed-images');

const IMAGES: { filename: string; label: string; url: string; usedBy: string[] }[] = [
  {
    filename: '01_mem_1_sunday_morning.jpg',
    label: '周日的早晨 / Hands Twined',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8dO2eq7rOX1kx02q9xiZxcQTmDfF0y5duj-qao6NgUP7HY3x8lCjMTW1doDBZB-DkNqtjdpNCI1SBuTdsrw97Tpxipi4lQv1GZmnJrgbwag-W4VxdrmqaKVnUvgm3MA7O9aHoAABmvflkBmhLH4CqdrBtD0Ng8N2ogBPQy8vaSn_lxDxT4OqZHqz5lOYIbfR-w0ouKgKvAmpZaUQyduTVny1piajuA6eD6EICpcXIB4dx2FxLVAshhE_Xmx71WwBk5kv9mmvUSG_6',
    usedBy: ['mem_1', 'PRELOAD: Hands Twined'],
  },
  {
    filename: '02_mem_2_misty.jpg',
    label: '迷雾 / Misty Mountains',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpl5vq8Vm5qFkrMQJ_NZVuxdr8chIVRBBI9lEvoScZL0WF1xE2r4gc32DzhCot4YrNL1G-mZI3yRG6JJK9_Lo9KBvd3QzarKcFnjCtDJxp5S1xTaiFjyuOfnLy_82NAsRFxDroxqvTIkpmKkRwSxTMuoINZG5At_JZ68R3aHOLuc5Odyfc_pQRbrwxk3KyLYhPUpx681v2hQ3JqZI3dfosfkUq8snriNT8s0KIZUvQF9t11aM1R04hyXjWWsBB4xkNGmiSIXZhfVWH',
    usedBy: ['mem_2', 'PRELOAD: Misty Mountains'],
  },
  {
    filename: '03_mem_3_venice.jpg',
    label: '威尼斯记忆 / Venice Balcony',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcH8taKK-cQTH5qII31Y13DpsFGAeCrAnq422szoCfs3xyIERgcGSKDf9KByrKOgzDG2vZ2n-FoyKsJUT3_HUvr4mEjA8tg9yhZn9k92SGWQVQm9VL2ud4uAnVh92qmhGhfVZukqfWQdGkRdP2GJqGr1Pj2jzbiTv9NRJQdjP6JlY18jrPEZOReR9LB-eWD9PNnzga-zdxxRvSmVagquCvloXNU7lrPEQbbLREpGA6DGW4L47Gr2h9cAV6JtiJtKoOtugEYBYjzXnm',
    usedBy: ['mem_3', 'PRELOAD: Venice Balcony'],
  },
  {
    filename: '04_mem_4_moment.jpg',
    label: '瞬时 / Vase & Branch',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwURGMuVbAPDZDRs8SH18MWawsLV0p3-B5WSwJH1RBTaLdbV3Zmo8sChdFOOlCGVmtDsJeDnqJ7GuqwCE4felM9lO7hJAEPFwxRB85FcTTqRkVuj7_6Tyop2yik9g-ZsLfTqpUNR3q4-ELoIkqWdfxlpcR4muAY56coyDlPIskAR966ALkh-Ua4-K-3OW-r8CwqVli4RdOtC6PLAcIOoVkBIFunuRtQVaTBVybZQNkOTbk7CO_-atZSxGmibceHbEnpRaOPxL4DzGz',
    usedBy: ['mem_4', 'PRELOAD: Vase & Branch'],
  },
  {
    filename: '05_mem_5_sunset.jpg',
    label: '忧郁时刻 / Sunset Ocean',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-wzEZSMIVzC6HyL7dXf1-Mok-urO1fowlRC5mJIF0rxww_abchdwMj-ZbBhONPV_Szt2uEW6XArQoczEejAcDZ6b-5uUwB2GHwPGW44uMFI0sqTzWn2327tFBIfZSGCLhArWRkYUxP0FIx5-dy3hh40mnsCxYtDN1aJ2ai1XDzlWaqeCr9BsT23fIUGDzHxzXgI7qWAqawAWPKZI-wtN9FuU1Qj5T30Dke90e8bWD1stllgyOwHHZNRTDd2FCL_QInbypUboU6_wG',
    usedBy: ['mem_5', 'PRELOAD: Sunset Ocean'],
  },
  {
    filename: '06_mem_6_camera.jpg',
    label: '显影中 / Vintage Camera',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLel6COq83OKEAUrGpIjQU-4zzBqi_qJSbAouWk5Zl5WS13LVmFzCp_tTXaBQ6s_xVDZs0jmFi5_ZnxsDYQpKMduLImEAH5PT7iSjdXqxgSKFkk8Vsq6yP6NHfIK82aYpL-OBY4u4Adk_3lH9kDZecMmuM-YsdFZmhj7-ZPPjzNhMkKSfYSO8X8AlgPGwJ_UcJXgoBO-unDMRMt3OVmOvY5hWPDZ0z7DlCFfGBRmKiT62u7VvXd8ShMCkJQpC2e897cN6b68nOYpqQ',
    usedBy: ['mem_6', 'PRELOAD: Vintage Camera'],
  },
  {
    filename: '07_wine_glasses.jpg',
    label: '红酒对饮 / Two Wine Glasses',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCOHahm6mC8E9rFp2AyfM6visbiEUYsCtVYecoIqcwAJKG-gf0aljG739sZkXUF1b3_5X7uvchc8EjTSo0EErTDxlzlHogXLjwQeZOIEbHLRw5YM1aZWRcFtN09ybxiFKPPXKGM06nHTnDocdVu0wbw0HvaE2OzLnhY2zEf-0XT3kaSZey8gXmDwmywBlAqQ8BQCdS3xkMH3e_UPkXAPhxnuMPSIR3IXX64APQL9PHLOUFbTt0UnLm3874l7rMi08b64IfW0roChWMV',
    usedBy: ['PRELOAD: Two Wine Glasses'],
  },
  {
    filename: '08_polaroids.jpg',
    label: '回忆合集 / Multiple Polaroids',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBeBSgkXuc6t_uSW10GxskfiegIpnL_l37C8A30GIIyceekFCUUTUSKtdNdVq9u8KrxbF5JWgD4GsQgVcZZ2CSTc7YWPOs5icy99ZmpYZew1wpnsc-uFCWQ4XzTjkOw63VDWLP8JV5OCUPIdaZtWOBzo0UNqxWCB9ShtgYjhCKjb083B3lNx0Txt2ah07_078u8O1WNydIa2zoKgTRsZjena7EM_mrmgLyCy6QDarTULqHJNWpXzliBnKGbo7CZkX9SZv76mbaomPCE',
    usedBy: ['PRELOAD: Multiple Polaroids'],
  },
  {
    filename: '09_cozy_bed.jpg',
    label: '慵懒早晨 / Cozy Bed',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ1bf4aHuyA1cQIIDEelvs_gFvG4sVxr-d4EFZKb6OHxju0AbnhUyx1M0tmr-JWHXfAFoO3Kb1Rkr-HvtwLCi1qYlXMXbxNEvnElFbv9GrztI24AS_kA8P_PMiQBCKaVVPkoiJeoxjALgbx-7Iskgq8XD2njm5GbElNXDhqz0DTA4ddsu7LuuLGql0kYV-PwirEUjDfZOUiG8LElF05X1wzUs6t_VY8cI24VClYnX0MVBVvDRCMg84BLZ8NyEU0sfenbrmReaw17yY',
    usedBy: ['msg_2', 'PRELOAD: Cozy Bed'],
  },
  {
    filename: '10_strawberry_cake.jpg',
    label: '草莓蛋糕 / Strawberry Cake',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8EFC5D_2Up4H_MFWiF7JVs5HjVDV_Lu9bIaw6eh5IcsLThYStpIWVPrNq2B7K-RiLA-KuFFi3qtiDdtNYaWk4NLoJg1FuP_ez5wdyl7ORNLEHULl31YLcRuVybtsYfhOeKfSdGYd85QvkV0RsQsBIkxJ0PSIhPz9l-uC_a4fNp1jWOsqJxIqxrEzfFKaRQaHWFxAccL4EmlXY5DqN6Eti2bSOJ5V4dHX7TQHrU7AGt6DnXbIai8SykV6ugI0CTSdxbQvle9QjCTLJ',
    usedBy: ['msg_1', 'PRELOAD: Strawberry Cake'],
  },
  {
    filename: '11_menu_1_pasta.jpg',
    label: '手工意面 / Tasty Pasta',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhaVpiALJlT2AHB8XJrgk_fPBOnDyMJ7xM6IpJPOqFId-jOx7Ji8EACqOWh1KMDORaGeL6ksJ4iWlGVxUqn-UqKn7UxRNxl0md_CPJEvgy-Wg4VGSIGnef3Z0yvLWsLy1Ts9ry77i0_ASegAWJI3qLGmFtO2cmNpa4Lidn24L0W8OFN_bl7hbIe9SrbQqpS7jwmJquxMM97ZEhSOf7KlgotlXrjJ6JFd1VnkEdqzjJsOF2P6e7B_bHM6m00XR7dc59qIrsdcd02AdX',
    usedBy: ['menu_1', 'PRELOAD: Tasty Pasta'],
  },
  {
    filename: '12_menu_2_steak.jpg',
    label: '周日烤肉 / Juicy Steak',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0xlZr3nqm6EGkLfFYpdIYs_zLa2mVqUKvaMfL1kG_XXwwkEnulUAGdI2EbcPOX22Frt5iGj-7A9yPeprxaRTPm38WWkRFmpCHg80SJnOmxOSg_C48yVZ2VO-gIY4ymaU4V92u4r93TG-XjwkwyMXYt_4FnQ8jYya3-Qyg_40qS7ZDr3XfuRgc6avsRj9lShaipDaQijSN-rJYwOkXTDWJUaUs0xfBf5aLenfr7LKDgjtjLUMl7oPLYti-Cu5GD8m9UlX8IoDW852G',
    usedBy: ['menu_2', 'PRELOAD: Juicy Steak'],
  },
  {
    filename: '13_menu_3_fish.jpg',
    label: '味增银鳕鱼 / Miso Sea Bass',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA00gWQAIYz1CWCR8O4rHLWOYXt-AVBRORZpzll4wPtn6j-KNaOkTht8Y5Wi2TK-dz038z25ATgCa90GelKdIQSL1OKiApAW-IM66FRzVmTSAKlj6omQOiqq-GNoVeAhrR8T2HwxtMV6wck8DLOKVig6KJaUExcf1g0OaUN1NpABFo_iAL_8_W_Qga_FMZYvta615T_u5TeusJTqn4OgmjJABf9QDhFODH6Dc6OVyysj8E2VEMyoNkbGVtJxqyfFQHN5LnXIFxxiGYe',
    usedBy: ['menu_3', 'PRELOAD: Miso Sea Bass'],
  },
  {
    filename: '14_menu_4_chocolate.jpg',
    label: '黑巧克力甘纳许 / Ganache Chocolate',
    url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1tpS9jwgNpN_q2aSJxjxm-eTGtFW5O-Fn-8IwiIEL-pCxW-nXp_ao0j2SEjxo6qdWq-7mohrmfA-aLsPda8bmsolh4BbROTWVmxV8GQpdWKf4n9DthyvKW8--JFAbyjywuL8ztfr4k6m_FjzqNBmBBhfD6qrzYdq_WqV-E0K2UHOZCBBLwOmLbBGisRWYP7E7orPkmKEBPQoBPRie-s993RYbIXU70PkG0OUTfNgW9XUFRUutws3Uk8YDvmZvL593BPYcm0prbt98',
    usedBy: ['menu_4', 'PRELOAD: Ganache Chocolate'],
  },
];

async function downloadOne(item: (typeof IMAGES)[0]): Promise<{ ok: boolean; error?: string }> {
  const dest = path.join(OUT_DIR, item.filename);
  try {
    const res = await fetch(item.url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; SharedSpace/1.0)' },
      redirect: 'follow',
    });
    if (!res.ok) {
      return { ok: false, error: `HTTP ${res.status}` };
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 500) {
      return { ok: false, error: 'Response too small (likely not an image)' };
    }
    fs.writeFileSync(dest, buf);
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const results: { filename: string; ok: boolean; error?: string }[] = [];

  for (const item of IMAGES) {
    process.stdout.write(`Downloading ${item.filename} ... `);
    const r = await downloadOne(item);
    results.push({ filename: item.filename, ...r });
    console.log(r.ok ? 'OK' : `FAILED (${r.error})`);
  }

  const manifest = {
    generatedAt: new Date().toISOString(),
    storageBucket: 'shared-space-images',
    suggestedStoragePath: 'presets/',
    images: IMAGES.map((item, i) => ({
      localFile: item.filename,
      label: item.label,
      usedBy: item.usedBy,
      supabasePath: `presets/${item.filename}`,
      downloadOk: results[i].ok,
      downloadError: results[i].error,
    })),
  };

  fs.writeFileSync(path.join(OUT_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2));

  const readme = `# Seed Images for Supabase Storage

共 ${IMAGES.length} 张不重复原图（来自 Google AI Studio 原始 URL）。

## 上传到 Supabase

1. 打开 Supabase Dashboard → **Storage** → bucket \`shared-space-images\`
2. 创建文件夹 \`presets\`（或在 bucket 根目录上传）
3. 将本目录下所有 \`.jpg\` 文件上传到 \`presets/\`
4. 上传后 public URL 格式：
   \`\`\`
   https://<你的项目>.supabase.co/storage/v1/object/public/shared-space-images/presets/<文件名>
   \`\`\`

## 文件与数据对照

| 本地文件 | 用途 |
|----------|------|
${IMAGES.map(i => `| \`${i.filename}\` | ${i.label} → ${i.usedBy.join(', ')} |`).join('\n')}

## 下载状态

${results.map(r => `- ${r.filename}: ${r.ok ? '成功' : `失败 (${r.error})`}`).join('\n')}

详细 JSON 见 \`manifest.json\`。
`;

  fs.writeFileSync(path.join(OUT_DIR, 'README.md'), readme);

  const failed = results.filter(r => !r.ok);
  if (failed.length > 0) {
    console.log(`\n${failed.length}/${results.length} failed.`);
    console.log('Google CDN may be blocked in your network.');
    console.log('Try: powershell -ExecutionPolicy Bypass -File scripts/download-seed-images.ps1');
    console.log('(Use VPN if needed) See seed-images/README.md');
    process.exit(1);
  }
  console.log(`\nAll ${results.length} images saved to seed-images/`);
}

main();
