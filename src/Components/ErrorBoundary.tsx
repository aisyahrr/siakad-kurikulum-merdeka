import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";
import { AlertOctagon, RotateCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.href = "/";
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#e9eef3] p-4 text-[#20272d]">
          <div className="w-full max-w-md rounded-[28px] bg-[#e9eef3] p-8 text-center shadow-[6px_6px_14px_#cbd3db,-6px_-6px_14px_#fff]">
            <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-[#fadbd8] text-[#c0392b] shadow-[inset_2px_2px_5px_#cbd3db,inset_-2px_-2px_5px_#fff]">
              <AlertOctagon size={32} />
            </div>
            <h1 className="text-xl font-extrabold text-[#17345b]">
              Terjadi Kesalahan Aplikasi
            </h1>
            <p className="mt-2 text-xs text-[#68777c]">
              Sistem mengalami kendala tak terduga. Silakan muat ulang halaman atau kembali ke beranda.
            </p>

            {this.state.error?.message && (
              <div className="mt-4 rounded-xl bg-[#edf2f6] p-3 text-left text-[11px] font-mono text-[#c0392b] shadow-[inset_1.5px_1.5px_3px_#cbd3db,inset_-1.5px_-1.5px_3px_#fff] overflow-x-auto">
                {this.state.error.message}
              </div>
            )}

            <button
              type="button"
              onClick={this.handleReload}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#17345b] px-6 py-2.5 text-xs font-bold text-white shadow-[3px_3px_7px_#cbd3db] transition hover:bg-[#102743]"
            >
              <RotateCcw size={14} />
              Kembali ke Beranda
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
