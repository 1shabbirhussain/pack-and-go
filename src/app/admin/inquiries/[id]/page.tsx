"use client";
import { useParams } from "next/navigation";
import { InquiryDetail } from "@/components/admin/Inquiries";
export default function InquiryPage() { const { id } = useParams<{ id: string }>(); return <InquiryDetail id={id} />; }
