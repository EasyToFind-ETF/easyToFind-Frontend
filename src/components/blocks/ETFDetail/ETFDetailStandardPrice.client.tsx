'use client';

import React from 'react';

const ETFDetailStandardPrice: React.FC = () => {
    return (
        <div id="standard-price" className="mx-auto w-full flex-1 min-w-0 pl-10 pt-10">
            <div className="bg-white rounded-3xl w-full px-16 py-16 shadow" style={{ borderRadius: '4rem' }}>
                <div>
                    <div className="text-2xl font-semibold mb-4">기준가격</div>
                <hr className="border-b-2 border-gray-200 mb-10" />
                <div className="overflow-x-auto">
                    <table className="min-w-full text-center border-separate border-spacing-0">
                    <thead>
                        <tr className="bg-[#F6F7F9] text-gray-500 text-base">
                        <th className="py-3 px-4 font-medium border-b border-gray-200" rowSpan={2}>일자</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-200" colSpan={2}>시장가격(원)</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-200" colSpan={2}>기준가격(원)</th>
                        </tr>
                        <tr className="bg-[#F6F7F9] text-gray-500 text-base">
                        <th className="py-3 px-4 font-medium border-b border-gray-200">종가</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-200">등락률(%)</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-200">기준가격</th>
                        <th className="py-3 px-4 font-medium border-b border-gray-200">등락률(%)</th>
                        </tr>
                    </thead>
                    <tbody className="text-base">
                        <tr>
                        <td className="py-3 px-4 border-b border-gray-100">2025.07.14</td>
                        <td className="py-3 px-4 border-b border-gray-100">11,250</td>
                        <td className="py-3 px-4 border-b border-gray-100 text-red-500">0.72</td>
                        <td className="py-3 px-4 border-b border-gray-100">11,252.64</td>
                        <td className="py-3 px-4 border-b border-gray-100 text-red-500">0.86</td>
                        </tr>
                        <tr>
                        <td className="py-3 px-4 border-b border-gray-100">2025.07.11</td>
                        <td className="py-3 px-4 border-b border-gray-100">11,330</td>
                        <td className="py-3 px-4 border-b border-gray-100 text-blue-500">-0.04</td>
                        <td className="py-3 px-4 border-b border-gray-100">11,157.09</td>
                        <td className="py-3 px-4 border-b border-gray-100 text-blue-500">-1.42</td>
                        </tr>
                        <tr>
                        <td className="py-3 px-4 border-b border-gray-100">2025.07.10</td>
                        <td className="py-3 px-4 border-b border-gray-100">11,335</td>
                        <td className="py-3 px-4 border-b border-gray-100 text-red-500">1.21</td>
                        <td className="py-3 px-4 border-b border-gray-100">11,317.57</td>
                        <td className="py-3 px-4 border-b border-gray-100 text-red-500">1.08</td>
                        </tr>
                        <tr>
                        <td className="py-3 px-4 border-b border-gray-100">2025.07.09</td>
                        <td className="py-3 px-4 border-b border-gray-100">11,200</td>
                        <td className="py-3 px-4 border-b border-gray-100 text-red-500">0.22</td>
                        <td className="py-3 px-4 border-b border-gray-100">11,196.10</td>
                        <td className="py-3 px-4 border-b border-gray-100 text-red-500">0.22</td>
                        </tr>
                        <tr>
                        <td className="py-3 px-4 border-b border-gray-100">2025.07.08</td>
                        <td className="py-3 px-4 border-b border-gray-100">11,175</td>
                        <td className="py-3 px-4 border-b border-gray-100 text-red-500">1.59</td>
                        <td className="py-3 px-4 border-b border-gray-100">11,171.69</td>
                        <td className="py-3 px-4 border-b border-gray-100 text-red-500">1.76</td>
                        </tr>
                        <tr>
                        <td className="py-3 px-4 border-b border-gray-100">2025.07.07</td>
                        <td className="py-3 px-4 border-b border-gray-100">11,000</td>
                        <td className="py-3 px-4 border-b border-gray-100 text-red-500">0.18</td>
                        <td className="py-3 px-4 border-b border-gray-100">10,978.54</td>
                        <td className="py-3 px-4 border-b border-gray-100 text-red-500">0.09</td>
                        </tr>
                    </tbody>
                    </table>
                </div>
                </div>
            </div>
        </div>
    );
};

export default ETFDetailStandardPrice;