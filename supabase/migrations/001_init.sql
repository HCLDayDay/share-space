-- Shared Space: single-couple schema + seed data
-- Run in Supabase SQL Editor, then create Storage bucket manually:
--   Bucket name: shared-space-images (public)

CREATE TABLE IF NOT EXISTS couple_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  partner_a_name text NOT NULL DEFAULT 'Z',
  partner_j_name text NOT NULL DEFAULT 'L',
  anniversary_date date NOT NULL DEFAULT '2023-01-15',
  custom_quote text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS memories (
  id text PRIMARY KEY,
  title text NOT NULL,
  image_url text NOT NULL,
  visibility text NOT NULL CHECK (visibility IN ('permanent', 'temp')),
  remaining_days int,
  author text NOT NULL CHECK (author IN ('A', 'J')),
  date_added timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS menu_items (
  id text PRIMARY KEY,
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('main', 'dessert', 'drink')),
  subtitle text NOT NULL DEFAULT '',
  tag text NOT NULL DEFAULT '分享爱',
  image_url text NOT NULL,
  author text NOT NULL CHECK (author IN ('A', 'J')),
  ingredients text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS messages (
  id text PRIMARY KEY,
  sender text NOT NULL CHECK (sender IN ('A', 'J')),
  type text NOT NULL CHECK (type IN ('surprise', 'film', 'menu_update', 'custom')),
  title text NOT NULL,
  detail_text text,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Seed couple settings (single row)
INSERT INTO couple_settings (partner_a_name, partner_j_name, anniversary_date, custom_quote)
VALUES (
  'Z',
  'L',
  '2023-01-15',
  '"在每一次共同的沉默中，我都能找到一千个爱你的理由。"'
)
ON CONFLICT DO NOTHING;

-- Seed memories
INSERT INTO memories (id, title, image_url, visibility, remaining_days, author, date_added) VALUES
  ('mem_1', '周日的早晨', 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8dO2eq7rOX1kx02q9xiZxcQTmDfF0y5duj-qao6NgUP7HY3x8lCjMTW1doDBZB-DkNqtjdpNCI1SBuTdsrw97Tpxipi4lQv1GZmnJrgbwag-W4VxdrmqaKVnUvgm3MA7O9aHoAABmvflkBmhLH4CqdrBtD0Ng8N2ogBPQy8vaSn_lxDxT4OqZHqz5lOYIbfR-w0ouKgKvAmpZaUQyduTVny1piajuA6eD6EICpcXIB4dx2FxLVAshhE_Xmx71WwBk5kv9mmvUSG_6', 'permanent', NULL, 'A', '2026-05-30T08:00:00Z'),
  ('mem_2', '迷雾', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpl5vq8Vm5qFkrMQJ_NZVuxdr8chIVRBBI9lEvoScZL0WF1xE2r4gc32DzhCot4YrNL1G-mZI3yRG6JJK9_Lo9KBvd3QzarKcFnjCtDJxp5S1xTaiFjyuOfnLy_82NAsRFxDroxqvTIkpmKkRwSxTMuoINZG5At_JZ68R3aHOLuc5Odyfc_pQRbrwxk3KyLYhPUpx681v2hQ3JqZI3dfosfkUq8snriNT8s0KIZUvQF9t11aM1R04hyXjWWsBB4xkNGmiSIXZhfVWH', 'temp', 3, 'J', '2026-06-01T15:30:00Z'),
  ('mem_3', '威尼斯记忆', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDcH8taKK-cQTH5qII31Y13DpsFGAeCrAnq422szoCfs3xyIERgcGSKDf9KByrKOgzDG2vZ2n-FoyKsJUT3_HUvr4mEjA8tg9yhZn9k92SGWQVQm9VL2ud4uAnVh92qmhGhfVZukqfWQdGkRdP2GJqGr1Pj2jzbiTv9NRJQdjP6JlY18jrPEZOReR9LB-eWD9PNnzga-zdxxRvSmVagquCvloXNU7lrPEQbbLREpGA6DGW4L47Gr2h9cAV6JtiJtKoOtugEYBYjzXnm', 'permanent', NULL, 'A', '2026-05-25T11:20:00Z'),
  ('mem_4', '瞬时', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwURGMuVbAPDZDRs8SH18MWawsLV0p3-B5WSwJH1RBTaLdbV3Zmo8sChdFOOlCGVmtDsJeDnqJ7GuqwCE4felM9lO7hJAEPFwxRB85FcTTqRkVuj7_6Tyop2yik9g-ZsLfTqpUNR3q4-ELoIkqWdfxlpcR4muAY56coyDlPIskAR966ALkh-Ua4-K-3OW-r8CwqVli4RdOtC6PLAcIOoVkBIFunuRtQVaTBVybZQNkOTbk7CO_-atZSxGmibceHbEnpRaOPxL4DzGz', 'temp', 7, 'J', '2026-05-29T09:15:00Z'),
  ('mem_5', '忧郁时刻', 'https://lh3.googleusercontent.com/aida-public/AB6AXuD-wzEZSMIVzC6HyL7dXf1-Mok-urO1fowlRC5mJIF0rxww_abchdwMj-ZbBhONPV_Szt2uEW6XArQoczEejAcDZ6b-5uUwB2GHwPGW44uMFI0sqTzWn2327tFBIfZSGCLhArWRkYUxP0FIx5-dy3hh40mnsCxYtDN1aJ2ai1XDzlWaqeCr9BsT23fIUGDzHxzXgI7qWAqawAWPKZI-wtN9FuU1Qj5T30Dke90e8bWD1stllgyOwHHZNRTDd2FCL_QInbypUboU6_wG', 'permanent', NULL, 'A', '2026-05-20T17:45:00Z'),
  ('mem_6', '显影中', 'https://lh3.googleusercontent.com/aida-public/AB6AXuCLel6COq83OKEAUrGpIjQU-4zzBqi_qJSbAouWk5Zl5WS13LVmFzCp_tTXaBQ6s_xVDZs0jmFi5_ZnxsDYQpKMduLImEAH5PT7iSjdXqxgSKFkk8Vsq6yP6NHfIK82aYpL-OBY4u4Adk_3lH9kDZecMmuM-YsdFZmhj7-ZPPjzNhMkKSfYSO8X8AlgPGwJ_UcJXgoBO-unDMRMt3OVmOvY5hWPDZ0z7DlCFfGBRmKiT62u7VvXd8ShMCkJQpC2e897cN6b68nOYpqQ', 'temp', 1, 'J', '2026-06-01T22:10:00Z')
ON CONFLICT (id) DO NOTHING;

-- Seed menu items
INSERT INTO menu_items (id, title, category, subtitle, tag, image_url, author, ingredients) VALUES
  ('menu_1', '手工意面', 'main', '精选高筋面粉与杜兰小麦，加入散养土鸡蛋手工揉面切条。入水微沸慢煮，出锅淋上初榨橄榄油与特调罗勒欧芹汁，清香盈口。', '分享爱', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhaVpiALJlT2AHB8XJrgk_fPBOnDyMJ7xM6IpJPOqFId-jOx7Ji8EACqOWh1KMDORaGeL6ksJ4iWlGVxUqn-UqKn7UxRNxl0md_CPJEvgy-Wg4VGSIGnef3Z0yvLWsLy1Ts9ry77i0_ASegAWJI3qLGmFtO2cmNpa4Lidn24L0W8OFN_bl7hbIe9SrbQqpS7jwmJquxMM97ZEhSOf7KlgotlXrjJ6JFd1VnkEdqzjJsOF2P6e7B_bHM6m00XR7dc59qIrsdcd02AdX', 'J', '精制高筋面粉、新鲜农场散养鸡蛋、手工研磨意式杜兰小麦面粉、初榨橄榄油、海盐、欧芹碎'),
  ('menu_2', '周日烤肉', 'main', '草饲牛肉洗净拍松，用露水迷迭香、现磨黑胡椒与无盐黄油腌制封煎，配以有机黄金土豆、胡萝卜置入烤排微火温慢烤。', '传承', 'https://lh3.googleusercontent.com/aida-public/AB6AXuC0xlZr3nqm6EGkLfFYpdIYs_zLa2mVqUKvaMfL1kG_XXwwkEnulUAGdI2EbcPOX22Frt5iGj-7A9yPeprxaRTPm38WWkRFmpCHg80SJnOmxOSg_C48yVZ2VO-gIY4ymaU4V92u4r93TG-XjwkwyMXYt_4FnQ8jYya3-Qyg_40qS7ZDr3XfuRgc6avsRj9lShaipDaQijSN-rJYwOkXTDWJUaUs0xfBf5aLenfr7LKDgjtjLUMl7oPLYti-Cu5GD8m9UlX8IoDW852G', 'A', '300克顶级草饲谷饲牛肉、新鲜露水迷迭香、精选黄金土豆、有机胡萝卜、現磨黑胡椒、天然无盐黄油'),
  ('menu_3', '味增银鳕鱼', 'main', '深海鳕鱼厚切沥干，双面细腻揉抹上红味噌、熟成米清酒与味醂腌制3天。微火慢焙烤至表面金黄、油脂盈溢，入口即化。', '禅意时刻', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA00gWQAIYz1CWCR8O4rHLWOYXt-AVBRORZpzll4wPtn6j-KNaOkTht8Y5Wi2TK-dz038z25ATgCa90GelKdIQSL1OKiApAW-IM66FRzVmTSAKlj6omQOiqq-GNoVeAhrR8T2HwxtMV6wck8DLOKVig6KJaUExcf1g0OaUN1NpABFo_iAL_8_W_Qga_FMZYvta615T_u5TeusJTqn4OgmjJABf9QDhFODH6Dc6OVyysj8E2VEMyoNkbGVtJxqyfFQHN5LnXIFxxiGYe', 'J', '深海新鲜银鳕鱼、日式红味噌、三日熟成秘密米曲清酒、优质味醂、赤砂糖、有机生姜泥'),
  ('menu_4', '黑巧克力甘纳许', 'dessert', '将70%比利时黑可可脂巧克力块与特重鲜奶油混合，温水慢隔慢熬出极致丝滑度，冷凝成形后，落上一瓣海盐之花。', '午夜', 'https://lh3.googleusercontent.com/aida-public/AB6AXuA1tpS9jwgNpN_q2aSJxjxm-eTGtFW5O-Fn-8IwiIEL-pCxW-nXp_ao0j2SEjxo6qdWq-7mohrmfA-aLsPda8bmsolh4BbROTWVmxV8GQpdWKf4n9DthyvKW8--JFAbyjywuL8ztfr4k6m_FjzqNBmBBhfD6qrzYdq_WqV-E0K2UHOZCBBLwOmLbBGisRWYP7E7orPkmKEBPQoBPRie-s993RYbIXU70PkG0OUTfNgW9XUFRUutws3Uk8YDvmZvL593BPYcm0prbt98', 'A', '70%比利时纯可可脂黑巧克力块、特浓动物重性鲜奶油、法国手工采集盐之花（Fleur de Sel）、马达加斯加天然香草荚')
ON CONFLICT (id) DO NOTHING;

-- Seed messages (created_at drives timestamp/dateKey on frontend)
INSERT INTO messages (id, sender, type, title, detail_text, image_url, created_at) VALUES
  ('msg_1', 'J', 'surprise', 'J 选择了 [甜点之旅] 作为今日惊喜。', NULL, 'https://lh3.googleusercontent.com/aida-public/AB6AXuD8EFC5D_2Up4H_MFWiF7JVs5HjVDV_Lu9bIaw6eh5IcsLThYStpIWVPrNq2B7K-RiLA-KuFFi3qtiDdtNYaWk4NLoJg1FuP_ez5wdyl7ORNLEHULl31YLcRuVybtsYfhOeKfSdGYd85QvkV0RsQsBIkxJ0PSIhPz9l-uC_a4fNp1jWOsqJxIqxrEzfFKaRQaHWFxAccL4EmlXY5DqN6Eti2bSOJ5V4dHX7TQHrU7AGt6DnXbIai8SykV6ugI0CTSdxbQvle9QjCTLJ', now() - interval '2 hours'),
  ('msg_2', 'A', 'film', 'A 上传了一张新胶卷：[周日的早晨]。', 'Sunday morning glow', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ1bf4aHuyA1cQIIDEelvs_gFvG4sVxr-d4EFZKb6OHxju0AbnhUyx1M0tmr-JWHXfAFoO3Kb1Rkr-HvtwLCi1qYlXMXbxNEvnElFbv9GrztI24AS_kA8P_PMiQBCKaVVPkoiJeoxjALgbx-7Iskgq8XD2njm5GbElNXDhqz0DTA4ddsu7LuuLGql0kYV-PwirEUjDfZOUiG8LElF05X1wzUs6t_VY8cI24VClYnX0MVBVvDRCMg84BLZ8NyEU0sfenbrmReaw17yY', now() - interval '1 day'),
  ('msg_3', 'J', 'menu_update', 'J 更新了菜单原料：[分享爱]。', '"Everything is prepared with the same quiet care we give to each other. Seasonal herbs, slow-cooked patience, and a dash of us."', NULL, now() - interval '3 days')
ON CONFLICT (id) DO NOTHING;
