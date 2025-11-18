import mezonPackage from '@mezon/package-js';
import { Button } from '@mezon/ui';
import { getPlatform, Platform } from '@mezon/utils';
import { useEffect, useState } from 'react';
import { ContactUs } from '../homepage/mezonpage/components/ContactUs';
import Footer from '../homepage/mezonpage/footer';
import HeaderMezon from '../homepage/mezonpage/header';

const ContactUsPage = () => {
	const platform = getPlatform();
	const version = mezonPackage.version;
	const [isContactFormOpen, setIsContactFormOpen] = useState(false);

	const downloadUrl: string =
		platform === Platform.MACOS
			? `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-mac-arm64.dmg`
			: platform === Platform.LINUX
				? `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-linux-amd64.deb`
				: `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-win-x64.exe`;
	const universalUrl = `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-mac-x64.dmg`;
	const portableUrl = `${process.env.NX_BASE_IMG_URL}/release/mezon-${version}-win-x64-portable.exe`;

	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<div className="min-h-screen bg-white">
			<HeaderMezon
				sideBarIsOpen={false}
				toggleSideBar={() => {
					('');
				}}
				scrollToSection={() => {
					('');
				}}
			/>

			<div className="pt-[80px] pb-16" style={{ fontFamily: 'SVN-Avo, sans-serif' }}>
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="py-12 sm:py-16">
						<h1 className="text-5xl sm:text-6xl  text-gray-900 mb-4">Contact Mezon</h1>
						<p className="text-lg sm:text-xl text-gray-600 max-w-2xl">
							Get in touch with our team for support, accessibility, enterprise inquiries, or privacy questions.
						</p>
					</div>

					<section className="mb-12">
						<h2 className="text-3xl  text-gray-900 mb-4">Mezon Support</h2>
						<p className="text-base sm:text-lg text-gray-700 mb-6">For all questions related to Mezon, contact us</p>
						<Button
							onClick={() => setIsContactFormOpen(true)}
							className="px-6 py-3 text-white  rounded-lg bg-gradient-to-r from-[#8661df] to-[#7979ed] hover:bg-gradient-to-l transition-all duration-200 shadow-md hover:shadow-lg"
						>
							Contact Us
						</Button>
					</section>

					<section className="mb-12">
						<h2 className="text-3xl  text-gray-900 mb-4">Mezon Accessibility and Assistive Technology Support</h2>
						<p className="text-base sm:text-lg text-gray-700 mb-4">
							To report accessibility-related issues or share suggestions, contact us
						</p>
						<p className="text-base sm:text-lg text-gray-700 mb-4">
							For all inquiries from users with disabilities including support with screen readers and assistive technology or with
							accessibility feedback about Mezon products contact us:{' '}
							<a href="mailto:accessibility@mezon.vn" className="text-[#8661df] hover:underline font-medium">
								hello@mezon.vn
							</a>
						</p>
						<p className="text-sm sm:text-base text-gray-600 italic">
							<strong>Important:</strong> If the request is not related to accessibility or is specific for Account Recovery or if you
							can't sign into your Mezon Account, contact account help
						</p>
					</section>

					<section className="mb-12">
						<h2 className="text-3xl  text-gray-900 mb-4">Mezon Enterprise Solutions</h2>
						<p className="text-base sm:text-lg text-gray-700 mb-6">
							If you are interested in testing our business solutions for large enterprises, you can fill out this survey
						</p>
						<Button
							onClick={() => setIsContactFormOpen(true)}
							className="px-6 py-3 text-white  rounded-lg bg-gradient-to-r from-[#8661df] to-[#7979ed] hover:bg-gradient-to-l transition-all duration-200 shadow-md hover:shadow-lg"
						>
							Fill Out Survey
						</Button>
					</section>

					<section className="mb-12">
						<h2 className="text-3xl  text-gray-900 mb-4">Privacy Policy Questions</h2>
						<p className="text-base sm:text-lg text-gray-700 mb-6">For all questions related to our Privacy Policy, contact us</p>
						<Button
							onClick={() => setIsContactFormOpen(true)}
							className="px-6 py-3 text-white  rounded-lg bg-gradient-to-r from-[#8661df] to-[#7979ed] hover:bg-gradient-to-l transition-all duration-200 shadow-md hover:shadow-lg"
						>
							Contact Us
						</Button>
					</section>

					<section className="mb-12">
						<h2 className="text-3xl  text-gray-900 mb-4">Corporate Address</h2>
						<div className="text-base sm:text-lg text-gray-700 space-y-2">
							<p className=" text-xl">Mezon</p>
							<p>2nd Floor, CT3 The Pride</p>
							<p>To Huu Street, Ha Dong</p>
							<p>Ha Noi, Vietnam</p>
							<p className="mt-4">
								Email:{' '}
								<a href="mailto:hello@mezon.vn" className="text-[#8661df] hover:underline font-medium">
									hello@mezon.vn
								</a>
							</p>
							<p>
								Phone:{' '}
								<a href="tel:+842466874606" className="text-[#8661df] hover:underline font-medium">
									(+84) 2466874606
								</a>
							</p>
						</div>
					</section>
				</div>
			</div>

			<Footer downloadUrl={downloadUrl} universalUrl={universalUrl} portableUrl={portableUrl} />

			<ContactUs isOpen={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} />
		</div>
	);
};

export default ContactUsPage;
