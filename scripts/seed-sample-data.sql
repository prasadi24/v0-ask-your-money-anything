-- Insert sample users
INSERT INTO users (id, email, created_at, last_login) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'demo@fingpt.com', NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 hour'),
  ('550e8400-e29b-41d4-a716-446655440002', 'investor@example.com', NOW() - INTERVAL '15 days', NOW() - INTERVAL '2 hours'),
  ('550e8400-e29b-41d4-a716-446655440003', 'trader@example.com', NOW() - INTERVAL '7 days', NOW() - INTERVAL '30 minutes')
ON CONFLICT (email) DO NOTHING;

-- Insert sample documents
INSERT INTO documents (id, name, type, file_path, size, upload_date, status, user_id) VALUES
  (
    '660e8400-e29b-41d4-a716-446655440001',
    'Axis Bluechip Fund Factsheet March 2024.pdf',
    'Mutual Fund',
    '/documents/axis-bluechip-march-2024.pdf',
    2400000,
    '2024-03-15',
    'processed',
    '550e8400-e29b-41d4-a716-446655440001'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440002',
    'Gold Price Report RBI Q1 2024.pdf',
    'Commodity Report',
    '/documents/gold-price-rbi-q1-2024.pdf',
    1800000,
    '2024-03-10',
    'processed',
    '550e8400-e29b-41d4-a716-446655440001'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440003',
    'Amaravati Real Estate Trends 2024.pdf',
    'Real Estate',
    '/documents/amaravati-real-estate-2024.pdf',
    3100000,
    '2024-03-08',
    'processing',
    '550e8400-e29b-41d4-a716-446655440002'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440004',
    'HDFC Top 100 Fund Performance Report.pdf',
    'Mutual Fund',
    '/documents/hdfc-top-100-performance.pdf',
    2200000,
    '2024-03-05',
    'processed',
    '550e8400-e29b-41d4-a716-446655440002'
  ),
  (
    '660e8400-e29b-41d4-a716-446655440005',
    'LIC ULIP Plans Comparison 2024.pdf',
    'Insurance',
    '/documents/lic-ulip-comparison-2024.pdf',
    1900000,
    '2024-03-01',
    'processed',
    '550e8400-e29b-41d4-a716-446655440003'
  )
ON CONFLICT (id) DO NOTHING;

-- Insert sample query logs
INSERT INTO query_logs (id, user_id, question, response, sources, timestamp) VALUES
  (
    '770e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'How did Axis Bluechip Fund perform in the last 5 years?',
    'Axis Bluechip Fund has delivered an annualized return of 13.2% over the last 5 years, significantly outperforming the benchmark Nifty 100 index. The fund focuses on large-cap stocks as per SEBI categorization and maintains a moderate risk profile with an expense ratio of 1.8%. Current AUM stands at ₹15,000 crores. Key holdings include Reliance Industries, HDFC Bank, and Infosys. The fund is suitable for investors with moderate risk appetite looking for long-term wealth creation.',
    ARRAY['Axis Bluechip Fund Factsheet March 2024.pdf'],
    NOW() - INTERVAL '2 hours'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    'What are the current gold prices and trends?',
    'Current gold prices as of March 2024 according to RBI data: 24K gold is trading at ₹6,245 per gram, while 22K gold is at ₹5,725 per gram. Gold prices have shown an upward trend of approximately 12% year-over-year due to global economic uncertainty, inflation concerns, and geopolitical tensions. The RBI report indicates continued demand from both retail and institutional investors. Sovereign Gold Bonds have seen increased inflows, making them an attractive option for portfolio diversification.',
    ARRAY['Gold Price Report RBI Q1 2024.pdf'],
    NOW() - INTERVAL '1 hour'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440003',
    '550e8400-e29b-41d4-a716-446655440002',
    'Should I invest in Amaravati real estate now?',
    'Amaravati real estate market shows promising growth with current average property prices at ₹4,500 per sq ft. The region is experiencing 8% annual growth due to ongoing infrastructure development, including the new capital city project and improved connectivity. However, consider these factors: 1) RERA approvals are still pending for some projects, 2) Infrastructure development timeline may face delays, 3) Market liquidity is relatively low compared to established cities. Recommendation: Suitable for long-term investors (5+ years) with moderate risk tolerance.',
    ARRAY['Amaravati Real Estate Trends 2024.pdf'],
    NOW() - INTERVAL '45 minutes'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440004',
    '550e8400-e29b-41d4-a716-446655440002',
    'Compare SIP vs lump sum for HDFC Top 100 Fund',
    'For HDFC Top 100 Fund investment comparison: SIP (Systematic Investment Plan) offers rupee cost averaging benefits, reducing market timing risk and making it suitable for regular income earners. Historical data shows SIP returns of 11.8% annually over 10 years. Lump sum investment can potentially generate higher returns (13.1% historically) if market timing is favorable, but carries higher risk. As per SEBI guidelines, this is a large-cap fund with moderate risk. Recommendation: SIP for beginners and regular investors, lump sum for experienced investors with market knowledge and surplus funds during market corrections.',
    ARRAY['HDFC Top 100 Fund Performance Report.pdf'],
    NOW() - INTERVAL '30 minutes'
  ),
  (
    '770e8400-e29b-41d4-a716-446655440005',
    '550e8400-e29b-41d4-a716-446655440003',
    'Which LIC policy offers the best returns?',
    'Based on the LIC ULIP comparison analysis: LIC New Jeevan Anand offers the best balance of returns and insurance coverage with projected returns of 8-10% annually. IRDA-regulated LIC ULIP plans show varying performance: Tech Fund (12% average), Balanced Fund (9% average), and Debt Fund (7% average). However, consider high charges in initial years (3-5% of premium). For pure investment purposes, SEBI-regulated mutual funds typically offer better returns. LIC policies are recommended primarily for insurance needs with investment as secondary benefit.',
    ARRAY['LIC ULIP Plans Comparison 2024.pdf'],
    NOW() - INTERVAL '15 minutes'
  )
ON CONFLICT (id) DO NOTHING;
