import type { ReactNode } from 'react';

interface IndianFoodGraphicProps {
  foodId: string;
  size?: number;
  quantity?: number;
  className?: string;
}

export type ThaliPlacement = 'katori' | 'main' | 'drink' | 'side';

export function getFoodPlacement(foodId: string): ThaliPlacement {
  if (
    [
      'chaas',
      'toned-milk',
      'sweet-lassi',
      'masala-chai-sugar',
      'green-tea',
      'coconut-water',
      'protein-shake',
      'cold-drink',
      'beer-pint',
      'whisky-peg',
      'wine-glass',
    ].includes(foodId)
  ) {
    return 'drink';
  }
  if (
    [
      'roti',
      'multigrain-roti',
      'aloo-paratha',
      'steamed-rice',
      'moong-chilla',
      'idli-sambar',
      'chole-bhature',
      'fresh-salad',
      'paneer-grilled',
      'boiled-eggs',
      'samosa',
    ].includes(foodId)
  ) {
    return 'main';
  }
  if (
    [
      'moong-dal',
      'rajma',
      'chole',
      'soya-chunks',
      'poha',
      'sprouts-chaat',
      'palak-sabzi',
      'bhindi-sabzi',
      'lauki-sabzi',
      'broccoli-stirfry',
      'plain-curd',
      'desi-ghee',
      'instant-noodles',
      'namkeen-bhujia',
      'gulab-jamun',
    ].includes(foodId)
  ) {
    return 'katori';
  }
  return 'side';
}

function SteelKatori({ children }: { children: ReactNode }) {
  return (
    <g>
      <circle cx="32" cy="33" r="27" fill="rgba(0,0,0,0.16)" />
      <circle cx="32" cy="32" r="27" fill="url(#steelRim)" stroke="#94a3b8" strokeWidth="1.2" />
      <circle cx="32" cy="32" r="23.2" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="0.8" />
      {children}
      <path
        d="M 11 22 A 24 24 0 0 1 28 8"
        fill="none"
        stroke="rgba(255,255,255,0.75)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </g>
  );
}

/**
 * Custom top-down realistic Indian food graphics for the Interactive Indian Thali.
 */
export function IndianFoodGraphic({
  foodId,
  size = 56,
  quantity = 1,
  className = '',
}: IndianFoodGraphicProps) {
  const renderArtwork = (): ReactNode => {
    switch (foodId) {
      case 'roti':
      case 'multigrain-roti': {
        const isMulti = foodId === 'multigrain-roti';
        const base = isMulti ? '#c89b65' : '#e5bf82';
        const rim = isMulti ? '#9c6e3b' : '#c6934d';
        const showStack = quantity > 1;
        return (
          <g>
            {showStack && (
              <ellipse
                cx="35"
                cy="36"
                rx="23"
                ry="21"
                fill={rim}
                stroke="#855828"
                strokeWidth="0.8"
                opacity="0.85"
              />
            )}
            <ellipse cx="31" cy="32" rx="24" ry="22" fill="rgba(0,0,0,0.14)" transform="translate(1,2)" />
            <ellipse cx="31" cy="31" rx="24" ry="22" fill={base} stroke={rim} strokeWidth="1.5" />
            {/* Realistic roasted phulka spots */}
            <ellipse cx="22" cy="23" rx="4.2" ry="2.6" fill="#8b4d1b" opacity="0.55" transform="rotate(-18 22 23)" />
            <ellipse cx="39" cy="25" rx="3.4" ry="2.2" fill="#7c4215" opacity="0.5" transform="rotate(24 39 25)" />
            <ellipse cx="32" cy="36" rx="5.0" ry="3.0" fill="#925422" opacity="0.48" transform="rotate(10 32 36)" />
            <ellipse cx="21" cy="38" rx="2.8" ry="1.8" fill="#7c4215" opacity="0.45" />
            <ellipse cx="43" cy="35" rx="3.0" ry="2.0" fill="#8b4d1b" opacity="0.42" />
            <circle cx="30" cy="24" r="1.4" fill="#6b3410" opacity="0.45" />
            {isMulti && (
              <>
                <circle cx="27" cy="31" r="1" fill="#5c3a1a" />
                <circle cx="36" cy="32" r="1" fill="#5c3a1a" />
                <circle cx="24" cy="28" r="0.9" fill="#5c3a1a" />
                <circle cx="38" cy="40" r="1" fill="#5c3a1a" />
              </>
            )}
          </g>
        );
      }

      case 'aloo-paratha':
        return (
          <g>
            <circle cx="32" cy="33" r="24" fill="rgba(0,0,0,0.16)" />
            <circle cx="32" cy="32" r="24" fill="#d99438" stroke="#9a5916" strokeWidth="1.6" />
            <path d="M14 28 Q26 16 44 22 Q50 38 30 48 Q16 44 14 28 Z" fill="#e6ab4c" opacity="0.65" />
            <ellipse cx="23" cy="24" rx="5" ry="2.8" fill="#8a410f" opacity="0.6" transform="rotate(-20 23 24)" />
            <ellipse cx="40" cy="36" rx="5" ry="3" fill="#8a410f" opacity="0.55" transform="rotate(18 40 36)" />
            {/* Butter pat on top */}
            <rect x="26" y="26" width="12" height="10" rx="2.2" fill="#fef08a" stroke="#eab308" strokeWidth="1" transform="rotate(12 32 31)" />
            <circle cx="20" cy="36" r="1.2" fill="#15803d" />
            <circle cx="42" cy="25" r="1.2" fill="#15803d" />
          </g>
        );

      case 'steamed-rice':
        return (
          <g>
            <ellipse cx="32" cy="35" rx="24" ry="21" fill="rgba(0,0,0,0.14)" />
            <ellipse cx="32" cy="32" rx="24" ry="21" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
            <ellipse cx="30" cy="30" rx="19" ry="16" fill="#ffffff" />
            {/* Basmati rice grains */}
            {[
              [22, 24, 20],
              [29, 21, -25],
              [37, 23, 35],
              [43, 29, -15],
              [20, 32, 45],
              [28, 30, 12],
              [35, 31, -30],
              [41, 36, 25],
              [25, 39, -20],
              [33, 40, 15],
              [39, 42, -10],
              [18, 37, 10],
              [32, 26, 60],
              [26, 35, -45],
            ].map(([x, y, rot], idx) => (
              <ellipse
                key={idx}
                cx={x}
                cy={y}
                rx="3.2"
                ry="1.2"
                fill="#e2e8f0"
                transform={`rotate(${rot} ${x} ${y})`}
              />
            ))}
            {/* Cumin & coriander garnish */}
            <ellipse cx="31" cy="30" rx="1.8" ry="0.7" fill="#78350f" transform="rotate(30 31 30)" />
            <ellipse cx="36" cy="33" rx="1.7" ry="0.7" fill="#78350f" transform="rotate(-25 36 33)" />
            <path d="M30 27 Q33 23 36 27 Q33 29 30 27 Z" fill="#16a34a" />
          </g>
        );

      case 'moong-dal':
        return (
          <SteelKatori>
            <circle cx="32" cy="32" r="22" fill="#eab308" />
            <circle cx="30" cy="30" r="17" fill="#facc15" opacity="0.65" />
            {/* Ghee & red chilli tadka */}
            <path d="M22 28 Q32 21 41 30" fill="none" stroke="#dc2626" strokeWidth="2.2" strokeLinecap="round" opacity="0.85" />
            <circle cx="29" cy="33" r="1.4" fill="#991b1b" />
            <circle cx="36" cy="27" r="1.2" fill="#78350f" />
            <circle cx="25" cy="35" r="1.1" fill="#78350f" />
            <path d="M30 32 Q35 28 38 33 Q34 36 30 32 Z" fill="#15803d" />
            <path d="M25 26 Q28 23 31 27 Q27 29 25 26 Z" fill="#16a34a" />
          </SteelKatori>
        );

      case 'rajma':
        return (
          <SteelKatori>
            <circle cx="32" cy="32" r="22" fill="#b45309" />
            <circle cx="32" cy="32" r="19" fill="#c2410c" opacity="0.85" />
            {/* Kidney beans */}
            {[
              [23, 25, 25],
              [35, 23, -20],
              [42, 31, 40],
              [29, 32, -15],
              [22, 37, 30],
              [37, 39, -35],
              [31, 42, 10],
            ].map(([x, y, rot], i) => (
              <ellipse
                key={i}
                cx={x}
                cy={y}
                rx="4.5"
                ry="2.6"
                fill="#7f1d1d"
                stroke="#450a0a"
                strokeWidth="0.6"
                transform={`rotate(${rot} ${x} ${y})`}
              />
            ))}
            <path d="M29 28 Q34 25 36 30 Q31 32 29 28 Z" fill="#22c55e" />
          </SteelKatori>
        );

      case 'chole':
        return (
          <SteelKatori>
            <circle cx="32" cy="32" r="22" fill="#92400e" />
            <circle cx="32" cy="32" r="19" fill="#b45309" opacity="0.8" />
            {[
              [24, 24],
              [34, 22],
              [41, 29],
              [29, 31],
              [22, 35],
              [37, 37],
              [30, 42],
              [42, 38],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="3.4" fill="#d97706" stroke="#78350f" strokeWidth="0.8" />
            ))}
            <circle cx="32" cy="31" r="4.5" fill="none" stroke="#fce7f3" strokeWidth="1.3" opacity="0.85" />
            <circle cx="27" cy="27" r="1.4" fill="#22c55e" />
          </SteelKatori>
        );

      case 'paneer-grilled':
        return (
          <g>
            <ellipse cx="32" cy="34" rx="25" ry="22" fill="#f0fdf4" stroke="#86efac" strokeWidth="1" />
            {/* Grilled Paneer Cubes */}
            {[
              [14, 18, -8],
              [31, 15, 10],
              [19, 32, 6],
              [36, 31, -12],
            ].map(([x, y, rot], idx) => (
              <g key={idx} transform={`rotate(${rot} ${x + 7} ${y + 6})`}>
                <rect x={x} y={y} width="15" height="13" rx="2.5" fill="#fef3c7" stroke="#d97706" strokeWidth="1.2" />
                <line x1={x + 2} y1={y + 4} x2={x + 13} y2={y + 4} stroke="#9a3412" strokeWidth="1.3" opacity="0.7" />
                <line x1={x + 2} y1={y + 9} x2={x + 13} y2={y + 9} stroke="#9a3412" strokeWidth="1.3" opacity="0.7" />
              </g>
            ))}
            {/* Mint chutney dab */}
            <circle cx="48" cy="44" r="5" fill="#16a34a" opacity="0.9" />
          </g>
        );

      case 'fresh-salad':
        return (
          <g>
            {/* Cucumber slices */}
            <circle cx="22" cy="26" r="11" fill="#15803d" />
            <circle cx="22" cy="26" r="8.8" fill="#bbf7d0" />
            <circle cx="22" cy="26" r="3.2" fill="#dcfce7" />
            {/* Tomato slice */}
            <circle cx="41" cy="24" r="10.5" fill="#dc2626" />
            <circle cx="41" cy="24" r="8" fill="#ef4444" />
            <path d="M41 16 L41 32 M33 24 L49 24" stroke="#fca5a5" strokeWidth="1.3" />
            {/* Carrot slices */}
            <circle cx="29" cy="42" r="8.5" fill="#ea580c" />
            <circle cx="29" cy="42" r="4.5" fill="#fdba74" />
            <circle cx="44" cy="40" r="7.5" fill="#f97316" />
            <circle cx="44" cy="40" r="3.8" fill="#fed7aa" />
            {/* Lemon wedge */}
            <path d="M13 38 A10 10 0 0 0 25 48 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="1" />
          </g>
        );

      case 'plain-curd':
        return (
          <SteelKatori>
            <circle cx="32" cy="32" r="22" fill="#f8fafc" />
            <circle cx="30" cy="30" r="18" fill="#ffffff" />
            <path d="M22 28 Q32 22 40 31" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
            {/* Roasted jeera powder & mint */}
            <circle cx="31" cy="32" r="1" fill="#78350f" />
            <circle cx="35" cy="30" r="0.9" fill="#78350f" />
            <circle cx="28" cy="35" r="0.9" fill="#78350f" />
            <path d="M31 28 Q36 25 38 30 Q34 32 31 28 Z" fill="#16a34a" />
          </SteelKatori>
        );

      case 'palak-sabzi':
      case 'bhindi-sabzi':
      case 'lauki-sabzi':
      case 'broccoli-stirfry': {
        const fillMain =
          foodId === 'palak-sabzi'
            ? '#166534'
            : foodId === 'lauki-sabzi'
              ? '#84cc16'
              : foodId === 'broccoli-stirfry'
                ? '#15803d'
                : '#4d7c0f';
        const accent =
          foodId === 'palak-sabzi'
            ? '#14532d'
            : foodId === 'lauki-sabzi'
              ? '#bef264'
              : foodId === 'broccoli-stirfry'
                ? '#facc15'
                : '#65a30d';
        return (
          <SteelKatori>
            <circle cx="32" cy="32" r="22" fill={fillMain} />
            {[
              [22, 24],
              [35, 22],
              [42, 31],
              [28, 33],
              [22, 39],
              [37, 40],
              [31, 44],
            ].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="4.2" fill={accent} opacity="0.85" />
            ))}
            {foodId === 'broccoli-stirfry' && (
              <>
                <rect x="26" y="25" width="7" height="4" rx="1.5" fill="#ef4444" transform="rotate(20 29 27)" />
                <rect x="35" y="34" width="7" height="4" rx="1.5" fill="#eab308" transform="rotate(-15 38 36)" />
              </>
            )}
          </SteelKatori>
        );
      }

      case 'sprouts-chaat':
        return (
          <SteelKatori>
            <circle cx="32" cy="32" r="22" fill="#ecfccb" />
            {[
              [23, 24],
              [31, 21],
              [40, 26],
              [25, 32],
              [34, 30],
              [42, 35],
              [27, 40],
              [36, 41],
            ].map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="2.8" fill="#4d7c0f" />
                <path d={`M${x + 2} ${y} Q${x + 5} ${y - 3} ${x + 6} ${y + 1}`} stroke="#fef9c3" strokeWidth="1.2" fill="none" />
              </g>
            ))}
            <rect x="29" y="27" width="4" height="4" rx="1" fill="#ef4444" />
            <rect x="37" y="33" width="4" height="4" rx="1" fill="#ef4444" />
            <circle cx="22" cy="36" r="2.2" fill="#f472b6" />
          </SteelKatori>
        );

      case 'soya-chunks':
        return (
          <SteelKatori>
            <circle cx="32" cy="32" r="22" fill="#b45309" opacity="0.88" />
            {[
              [23, 24],
              [36, 23],
              [42, 33],
              [29, 32],
              [22, 37],
              [36, 40],
            ].map(([x, y], i) => (
              <ellipse key={i} cx={x} cy={y} rx="5.2" ry="4" fill="#d97706" stroke="#78350f" strokeWidth="0.9" />
            ))}
            <path d="M30 27 Q34 24 37 28 Q32 30 30 27 Z" fill="#22c55e" />
          </SteelKatori>
        );

      case 'poha':
        return (
          <SteelKatori>
            <circle cx="32" cy="32" r="22" fill="#fde047" />
            {[
              [22, 26],
              [35, 24],
              [40, 34],
              [26, 38],
              [34, 39],
            ].map(([x, y], i) => (
              <ellipse key={i} cx={x} cy={y} rx="3.2" ry="2" fill="#b45309" transform={`rotate(${i * 35} ${x} ${y})`} />
            ))}
            <circle cx="29" cy="29" r="2" fill="#16a34a" />
            <circle cx="37" cy="31" r="2" fill="#16a34a" />
            <circle cx="31" cy="35" r="2" fill="#ef4444" />
          </SteelKatori>
        );

      case 'idli-sambar':
        return (
          <g>
            {/* 2 Soft White Idlis */}
            <circle cx="22" cy="25" r="13" fill="rgba(0,0,0,0.12)" />
            <circle cx="21" cy="24" r="13" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.2" />
            <circle cx="43" cy="31" r="13" fill="rgba(0,0,0,0.12)" />
            <circle cx="42" cy="30" r="13" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1.2" />
            {/* Small Sambar bowl */}
            <circle cx="25" cy="46" r="11" fill="#94a3b8" />
            <circle cx="25" cy="46" r="9" fill="#d97706" />
            <circle cx="25" cy="46" r="2" fill="#16a34a" />
          </g>
        );

      case 'moong-chilla':
        return (
          <g>
            <circle cx="32" cy="33" r="23" fill="rgba(0,0,0,0.14)" />
            <circle cx="32" cy="32" r="23" fill="#ca8a04" stroke="#854d0e" strokeWidth="1.5" />
            <path d="M16 32 Q32 16 48 32" fill="#eab308" opacity="0.7" />
            {/* Paneer stuffing peeking out */}
            <rect x="23" y="29" width="18" height="7" rx="3" fill="#fefce8" stroke="#cbd5e1" strokeWidth="0.8" />
            <circle cx="27" cy="32" r="1.2" fill="#16a34a" />
            <circle cx="35" cy="32" r="1.2" fill="#ef4444" />
          </g>
        );

      case 'boiled-eggs':
        return (
          <g>
            <ellipse cx="22" cy="31" rx="13" ry="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.4" transform="rotate(-14 22 31)" />
            <circle cx="22" cy="32" r="6.5" fill="#facc15" stroke="#eab308" strokeWidth="1" />
            <ellipse cx="43" cy="33" rx="13" ry="16" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.4" transform="rotate(14 43 33)" />
            <circle cx="43" cy="34" r="6.5" fill="#facc15" stroke="#eab308" strokeWidth="1" />
          </g>
        );

      case 'chole-bhature':
        return (
          <g>
            <ellipse cx="26" cy="26" rx="19" ry="14" fill="#f59e0b" stroke="#b45309" strokeWidth="1.5" transform="rotate(-14 26 26)" />
            <ellipse cx="38" cy="40" rx="17" ry="12" fill="#fbbf24" stroke="#b45309" strokeWidth="1.5" transform="rotate(12 38 40)" />
            <circle cx="46" cy="22" r="10.5" fill="#94a3b8" />
            <circle cx="46" cy="22" r="8.5" fill="#7c2d12" />
          </g>
        );

      case 'samosa':
        return (
          <g>
            <path d="M32 10 L54 48 Q32 54 10 48 Z" fill="rgba(0,0,0,0.16)" transform="translate(1,2)" />
            <path d="M32 10 L53 47 Q32 53 11 47 Z" fill="#d97706" stroke="#92400e" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M32 14 L46 42 Q32 46 18 42 Z" fill="#f59e0b" opacity="0.65" />
            <circle cx="28" cy="34" r="1.4" fill="#78350f" />
            <circle cx="36" cy="38" r="1.4" fill="#78350f" />
          </g>
        );

      case 'chaas':
      case 'toned-milk':
      case 'sweet-lassi':
      case 'masala-chai-sugar':
      case 'green-tea':
      case 'coconut-water':
      case 'protein-shake':
      case 'cold-drink':
      case 'beer-pint':
      case 'whisky-peg':
      case 'wine-glass': {
        const drinkFill =
          foodId === 'masala-chai-sugar'
            ? '#b45309'
            : foodId === 'green-tea'
              ? '#84cc16'
              : foodId === 'coconut-water'
                ? '#e0f2fe'
                : foodId === 'protein-shake'
                  ? '#78350f'
                  : foodId === 'cold-drink'
                    ? '#451a03'
                    : foodId === 'beer-pint'
                      ? '#f59e0b'
                      : foodId === 'whisky-peg'
                        ? '#d97706'
                        : foodId === 'wine-glass'
                          ? '#881337'
                          : foodId === 'sweet-lassi'
                            ? '#fef9c3'
                            : '#f8fafc';
        return (
          <g>
            <circle cx="32" cy="34" r="22" fill="rgba(0,0,0,0.15)" />
            {/* Steel glass / cup rim */}
            <circle cx="32" cy="32" r="22" fill="url(#steelRim)" stroke="#94a3b8" strokeWidth="1.5" />
            <circle cx="32" cy="32" r="18" fill={drinkFill} />
            {foodId === 'masala-chai-sugar' && (
              <path d="M51 28 Q59 32 51 36" fill="none" stroke="#cbd5e1" strokeWidth="3.5" strokeLinecap="round" />
            )}
            {foodId === 'chaas' && (
              <>
                <circle cx="30" cy="30" r="1.4" fill="#15803d" />
                <circle cx="35" cy="33" r="1.2" fill="#78350f" />
                <circle cx="28" cy="35" r="1.1" fill="#16a34a" />
              </>
            )}
            {foodId === 'coconut-water' && (
              <circle cx="32" cy="32" r="22" fill="none" stroke="#15803d" strokeWidth="3.2" />
            )}
            <path d="M22 24 A13 13 0 0 1 36 20" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
          </g>
        );
      }

      case 'desi-ghee':
        return (
          <SteelKatori>
            <circle cx="32" cy="32" r="20" fill="#fde047" />
            <circle cx="30" cy="30" r="13" fill="#fef08a" opacity="0.7" />
          </SteelKatori>
        );

      case 'soaked-almonds':
      case 'roasted-chana':
      case 'roasted-makhana':
      case 'chia-seeds':
      case 'flax-seeds':
      case 'pumpkin-seeds':
      case 'peanut-butter': {
        const nutColor =
          foodId === 'roasted-makhana'
            ? '#fef9c3'
            : foodId === 'pumpkin-seeds'
              ? '#4d7c0f'
              : foodId === 'chia-seeds'
                ? '#334155'
                : foodId === 'roasted-chana'
                  ? '#eab308'
                  : foodId === 'peanut-butter'
                    ? '#c27803'
                    : '#92400e';
        return (
          <g>
            <circle cx="32" cy="32" r="23" fill="#f5f5f4" stroke="#d6d3d1" strokeWidth="1.4" />
            {foodId === 'peanut-butter' ? (
              <circle cx="32" cy="32" r="18" fill={nutColor} />
            ) : (
              [
                [23, 24, 25],
                [35, 22, -20],
                [42, 31, 40],
                [28, 32, -15],
                [22, 39, 35],
                [37, 40, -30],
                [31, 43, 15],
              ].map(([x, y, rot], i) => (
                <ellipse
                  key={i}
                  cx={x}
                  cy={y}
                  rx={foodId === 'chia-seeds' ? 2.2 : 4.5}
                  ry={foodId === 'roasted-makhana' ? 4.2 : 2.6}
                  fill={nutColor}
                  stroke="#78350f"
                  strokeWidth="0.6"
                  transform={`rotate(${rot} ${x} ${y})`}
                />
              ))
            )}
          </g>
        );
      }

      case 'gulab-jamun':
        return (
          <SteelKatori>
            <circle cx="32" cy="32" r="21" fill="#fef3c7" />
            <circle cx="32" cy="32" r="14" fill="#7c2d12" stroke="#451a03" strokeWidth="1.2" />
            <circle cx="28" cy="27" r="4" fill="#b45309" opacity="0.55" />
            <circle cx="32" cy="31" r="1.4" fill="#84cc16" />
          </SteelKatori>
        );

      case 'biscuits-4':
        return (
          <g>
            <rect x="12" y="16" width="24" height="16" rx="4" fill="#d97706" stroke="#92400e" strokeWidth="1.2" transform="rotate(-10 24 24)" />
            <rect x="26" y="28" width="24" height="16" rx="4" fill="#f59e0b" stroke="#92400e" strokeWidth="1.2" transform="rotate(8 38 36)" />
            <circle cx="34" cy="35" r="1.2" fill="#78350f" />
            <circle cx="40" cy="36" r="1.2" fill="#78350f" />
            <circle cx="21" cy="24" r="1.2" fill="#78350f" />
          </g>
        );

      case 'namkeen-bhujia':
      case 'instant-noodles':
        return (
          <SteelKatori>
            <circle cx="32" cy="32" r="21" fill="#f59e0b" />
            <path
              d="M18 28 Q26 20 34 28 T46 28 M18 35 Q28 28 36 36 T46 35 M22 41 Q32 36 42 42"
              fill="none"
              stroke="#fef08a"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </SteelKatori>
        );

      default:
        return (
          <SteelKatori>
            <circle cx="32" cy="32" r="20" fill="#10b981" />
          </SteelKatori>
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`shrink-0 drop-shadow-sm ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="steelRim" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f8fafc" />
          <stop offset="50%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#94a3b8" />
        </linearGradient>
      </defs>
      {renderArtwork()}
    </svg>
  );
}
