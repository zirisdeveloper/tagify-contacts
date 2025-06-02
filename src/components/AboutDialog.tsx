
import React from "react";
import { Facebook, Mail } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useLanguage } from "@/context/LanguageContext";
import AppIconSvg from "@/components/AppIconSvg";

interface AboutDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AboutDialog: React.FC<AboutDialogProps> = ({ open, onOpenChange }) => {
  const { t, language } = useLanguage();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="mx-auto mb-6">
            <div className="w-20 h-20 mx-auto">
              <AppIconSvg className="w-full h-full" />
            </div>
          </div>
          <AlertDialogTitle className="text-center text-xl">
            {language === "en" ? "Backdoor" : "Piston"} v.2.5
          </AlertDialogTitle>
          <div className="py-4 text-center">
            {t("developedBy")} Mahfoud Bouziri
          </div>
        </AlertDialogHeader>
        <div className="flex items-center justify-between mt-8">
          <div className="flex items-center space-x-2">
            <a
              href="https://facebook.com/zirisdeveloper"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a
              href="mailto:zirisdeveloper@gmail.com"
              className="p-2 rounded-full hover:bg-accent transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
          <span className="text-sm text-muted-foreground">
            copyright zirisdeveloper
          </span>
        </div>
        <AlertDialogFooter>
          <AlertDialogAction>{t("close")}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AboutDialog;
