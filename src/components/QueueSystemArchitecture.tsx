import React, { useState } from 'react';
import { MathView } from './MathView';
import { Network, Users, ArrowRight, Server, Clock, GitMerge, FileSpreadsheet, CheckCircle } from 'lucide-react';

export const QueueSystemArchitecture: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'components' | 'kendall' | 'disciplines'>('components');

  return (
    <section id="principles" className="py-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
        <div>
          <span className="text-xs font-mono text-cyan-400 tracking-wider">01. KIẾN TRÚC & NGUYÊN TẮC HOẠT ĐỘNG</span>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mt-1">
            Bản Chất & Cấu Trúc Hệ Thống Hàng Chờ
          </h2>
        </div>
        {/* Navigation tabs */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('components')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'components'
                ? 'bg-cyan-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            6 Thành Phần Cốt Lõi
          </button>
          <button
            onClick={() => setActiveTab('kendall')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'kendall'
                ? 'bg-cyan-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ký Hiệu Chuẩn Kendall (A/B/c/K)
          </button>
          <button
            onClick={() => setActiveTab('disciplines')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeTab === 'disciplines'
                ? 'bg-cyan-500 text-slate-950 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Kỷ Luật & Hành Vi Khách
          </button>
        </div>
      </div>

      {/* Main Flow Diagram Graphic */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 mb-8 backdrop-blur">
        <h3 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <Network className="w-4 h-4 text-cyan-400" />
          <span>Sơ Đồ Dòng Chảy Tổng Quát Của Mọi Hệ Thống Hàng Chờ</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Phase 1: Source & Arrival */}
          <div className="bg-slate-950 border border-cyan-500/30 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400 mb-2">
                <span>GIAI ĐOẠN 1</span>
                <span>λ (khách/phút)</span>
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">Nguồn Đến (Arrival)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tập hợp thực thể (khách hàng, gói tin mạng, cuộc gọi) phát sinh yêu cầu theo quy luật ngẫu nhiên.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
              Phân phối Poisson / Exponential
            </div>
          </div>

          {/* Phase 2: Queue Buffer */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
                <span>GIAI ĐOẠN 2</span>
                <span>Lq & Wq</span>
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">Hàng Đợi (Queue Buffer)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Nơi lưu trữ khách chờ khi tất cả các quầy đang bận. Quản lý theo kỷ luật xếp hàng (FIFO/Priority).
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
              Dung lượng K (hữu hạn hoặc vô hạn)
            </div>
          </div>

          {/* Phase 3: Service Facility */}
          <div className="bg-slate-950 border border-purple-500/30 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-purple-400 mb-2">
                <span>GIAI ĐOẠN 3</span>
                <span>c quầy · μ</span>
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">Cơ Chế Phục Vụ (Servers)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gồm c kênh song song phục vụ. Mỗi kênh tiêu tốn thời gian ngẫu nhiên (hoặc cố định) để xử lý.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
              Tốc độ phục vụ trung bình μ
            </div>
          </div>

          {/* Phase 4: Output / Departure */}
          <div className="bg-slate-950 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-2">
                <span>GIAI ĐOẠN 4</span>
                <span>Đã Hoàn Tất</span>
              </div>
              <h4 className="font-semibold text-white text-sm mb-1">Rời Khỏi Hệ Thống</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Khách nhận kết quả/sản phẩm và rời đi. Tổng thời gian trong hệ thống là <MathView formula="W = W_q + 1/\mu" />.
              </p>
            </div>
            <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
              Định luật Little: L = λW
            </div>
          </div>
        </div>
      </div>

      {/* Tab 1: 6 Core Components */}
      {activeTab === 'components' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5">
            <span className="text-xs font-mono text-cyan-400 block mb-1">THÀNH PHẦN 01</span>
            <h4 className="text-base font-semibold text-white mb-2">1. Quy mô Nguồn Khách Đến</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              • <strong>Nguồn vô hạn (Infinite):</strong> Số lượng khách tiềm năng lớn đến mức việc một người đến không làm ảnh hưởng xác suất người tiếp theo đến (siêu thị, trạm xăng, website).<br />
              • <strong>Nguồn hữu hạn (Finite):</strong> Số lượng khách giới hạn (ví dụ: 10 máy dệt hỏng chờ 2 thợ sửa).
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5">
            <span className="text-xs font-mono text-cyan-400 block mb-1">THÀNH PHẦN 02</span>
            <h4 className="text-base font-semibold text-white mb-2">2. Quy Luật Dòng Đến (Arrival Pattern)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Thời gian giữa 2 lần đến liên tiếp tuân theo phân phối xác suất. Phổ biến nhất là phân phối Poisson (số khách đến trong khoảng t) tương đương thời gian giữa 2 lần đến là <strong>Hàm Mũ (Exponential Distribution)</strong> với tham số <MathView formula="\lambda" />.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5">
            <span className="text-xs font-mono text-cyan-400 block mb-1">THÀNH PHẦN 03</span>
            <h4 className="text-base font-semibold text-white mb-2">3. Kỷ Luật Xếp Hàng (Discipline)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quy tắc chọn người phục vụ tiếp theo:<br />
              • <strong>FIFO</strong>: Vào trước ra trước (chuẩn nhất ở quầy thu ngân).<br />
              • <strong>LIFO</strong>: Vào sau ra trước (ngăn xếp stack, kho hàng).<br />
              • <strong>Priority</strong>: Ưu tiên bệnh nhân cấp cứu, khách hàng VIP.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5">
            <span className="text-xs font-mono text-cyan-400 block mb-1">THÀNH PHẦN 04</span>
            <h4 className="text-base font-semibold text-white mb-2">4. Cấu Trúc Kênh Phục Vụ</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              • <strong>Đơn kênh (Single-server):</strong> 1 quầy duy nhất (M/M/1).<br />
              • <strong>Đa kênh song song (Multi-server):</strong> c quầy song song dùng chung 1 hàng (M/M/c) giúp tối ưu hóa thời gian rảnh rỗi.<br />
              • <strong>Nhiều giai đoạn (Multi-stage):</strong> Khám bệnh xong sang xét nghiệm, rồi sang lấy thuốc.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5">
            <span className="text-xs font-mono text-cyan-400 block mb-1">THÀNH PHẦN 05</span>
            <h4 className="text-base font-semibold text-white mb-2">5. Dung Lượng Hệ Thống (Capacity K)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sức chứa tối đa của phòng chờ hay bộ đệm (Buffer). Nếu đạt ngưỡng K, các yêu cầu tiếp theo sẽ bị từ chối phục vụ (Drop/Balk). Trong mạng máy tính, đây là nguyên nhân gây nghẽn mất gói tin (Packet Loss).
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5">
            <span className="text-xs font-mono text-cyan-400 block mb-1">THÀNH PHẦN 06</span>
            <h4 className="text-base font-semibold text-white mb-2">6. Tốc Độ Phục Vụ (Service Rate μ)</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Số lượng khách hàng mà một quầy có thể hoàn thành trong một đơn vị thời gian khi liên tục bận. Thời gian phục vụ có thể là biến ngẫu nhiên theo hàm mũ (M) hoặc thời gian cố định không đổi (D).
            </p>
          </div>
        </div>
      )}

      {/* Tab 2: Kendall Notation Breakdown */}
      {activeTab === 'kendall' && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-6">
          <div className="mb-4">
            <span className="text-xs font-mono text-cyan-400 block">TIÊU CHUẨN QUỐC TẾ CỦA DAVID G. KENDALL (1953)</span>
            <h3 className="text-lg font-bold text-white mt-1">
              Ký Hiệu Định Danh: <span className="font-mono text-cyan-300">A / B / c / K / N / D</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
              <span className="text-xl font-bold font-mono text-cyan-300">A</span>
              <span className="block text-xs font-semibold text-white mt-1">Phân phối đến</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">M, D, Ek, G</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
              <span className="text-xl font-bold font-mono text-cyan-300">B</span>
              <span className="block text-xs font-semibold text-white mt-1">Phân phối phục vụ</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">M, D, Ek, G</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
              <span className="text-xl font-bold font-mono text-cyan-300">c</span>
              <span className="block text-xs font-semibold text-white mt-1">Số lượng quầy</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">1, 2, 3... c</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
              <span className="text-xl font-bold font-mono text-cyan-300">K</span>
              <span className="block text-xs font-semibold text-white mt-1">Dung lượng tối đa</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Mặc định ∞</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
              <span className="text-xl font-bold font-mono text-cyan-300">N</span>
              <span className="block text-xs font-semibold text-white mt-1">Quy mô nguồn</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">Mặc định ∞</span>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
              <span className="text-xl font-bold font-mono text-cyan-300">D</span>
              <span className="block text-xs font-semibold text-white mt-1">Kỷ luật hàng đợi</span>
              <span className="text-[11px] text-slate-400 block mt-0.5">FIFO, LIFO, PRI</span>
            </div>
          </div>

          <div className="bg-slate-900/60 rounded-lg p-4 border border-slate-800/80">
            <span className="text-xs font-semibold text-slate-200 block mb-2">Ý nghĩa các ký tự viết tắt quy ước:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs text-slate-400">
              <div>
                <strong className="text-cyan-300 font-mono">M (Markovian):</strong> Phân phối Poisson (thời gian đến) hoặc Exponential (thời gian phục vụ). Không có bộ nhớ (Memoryless).
              </div>
              <div>
                <strong className="text-emerald-300 font-mono">D (Deterministic):</strong> Thời gian hoàn toàn cố định chính xác (ví dụ đóng chai tự động mất đúng 2 giây).
              </div>
              <div>
                <strong className="text-amber-300 font-mono">Ek (Erlang-k):</strong> Phân phối Erlang bậc k, mô tả các giai đoạn tuần tự.
              </div>
              <div>
                <strong className="text-purple-300 font-mono">G (General):</strong> Phân phối tổng quát bất kỳ có trung bình và phương sai xác định.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Customer Behavior & Disciplines */}
      {activeTab === 'disciplines' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5">
            <div className="flex items-center gap-2 text-rose-400 mb-2">
              <span className="text-lg">🚪</span>
              <h4 className="font-semibold text-white text-sm">Hiện Tượng Balking (Quay Xe)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Khách hàng vừa bước tới cửa hàng, thấy hàng chờ quá đông liền quyết định <strong>quay đầu bỏ đi ngay</strong> mà không bước vào hàng. Doanh nghiệp mất doanh thu ngay tại cổng vào.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <span className="text-lg">⏳</span>
              <h4 className="font-semibold text-white text-sm">Hiện Tượng Reneging (Bỏ Cuộc)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Khách hàng đã chấp nhận đứng vào hàng, nhưng sau một khoảng thời gian chờ đợi quá lâu mà chưa được phục vụ, họ <strong>mất kiên nhẫn và tự ý rời hàng</strong> (phổ biến nhất ở tổng đài CSKH).
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-5">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <span className="text-lg">🔀</span>
              <h4 className="font-semibold text-white text-sm">Hiện Tượng Jockeying (Nhảy Hàng)</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Trong mô hình nhiều hàng song song riêng rẽ (như siêu thị truyền thống), khách thấy hàng bên cạnh di chuyển nhanh hơn nên <strong>nhảy sang hàng khác</strong>. Giải pháp tối ưu là chuyển sang mô hình <em>1 hàng chung duy nhất cho tất cả các quầy</em>.
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
